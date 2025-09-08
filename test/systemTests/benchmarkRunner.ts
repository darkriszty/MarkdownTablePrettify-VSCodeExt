import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { getDistinctTestFileNames } from './systemTestFileReader';
import { getDocumentPrettyfier } from '../../src/extension/prettyfierFactory';

interface BenchmarkResults {
    factoryCreation: {
        iterations: number;
        times: number[];
        average: number;
        median: number;
        min: number;
        max: number;
        standardDeviation: number;
        confidenceInterval95: { lower: number; upper: number };
        totalDuration: number;
    };
    documentFormatting: {
        [size: string]: {
            files: string[];
            iterations: number;
            times: number[];
            average: number;
            median: number;
            min: number;
            max: number;
            standardDeviation: number;
            confidenceInterval95: { lower: number; upper: number };
            totalDuration: number;
        };
    };
    overallDuration: number;
    timestamp: string;
}

class PerformanceBenchmark {
    private results: BenchmarkResults;
    private testFiles: { name: string; size: 'small' | 'medium' | 'large' }[] = [];
    private overallStartTime: bigint = BigInt(0);

    private readonly baseline = {
        factoryCreation: { average: 0.0001675, median: 0.0001522, standardDeviation: 0.0001 },
        documentFormatting: {
            small: { average: 0.1429, median: 0.1162, standardDeviation: 0.05 },
            medium: { average: 0.2358, median: 0.2186, standardDeviation: 0.08 },
            large: { average: 4.2929, median: 2.2453, standardDeviation: 2.0 }
        }
    };

    private readonly thresholds = { improvement: 0.5, warning: 1.5, failure: 2 };

    constructor() {
        this.results = {
            factoryCreation: {
                iterations: 0,
                times: [],
                average: 0,
                median: 0,
                min: 0,
                max: 0,
                standardDeviation: 0,
                confidenceInterval95: { lower: 0, upper: 0 },
                totalDuration: 0
            },
            documentFormatting: {},
            overallDuration: 0,
            timestamp: new Date().toISOString()
        };
    }

    private checkPerformanceRegression(): void {
        console.log(`\n📊 Comparing against hard-coded baseline`);
        
        let hasRegression = false;
        
        // Factory creation comparison
        const factoryRegression = this.comparePerformance(
            'Factory creation',
            this.results.factoryCreation.average,
            this.baseline.factoryCreation.average,
            6
        );
        hasRegression = hasRegression || factoryRegression;
        
        // Document formatting comparisons
        for (const [size, results] of Object.entries(this.results.documentFormatting)) {
            if (this.baseline.documentFormatting[size]) {
                const documentRegression = this.comparePerformance(
                    `Document formatting (${size})`,
                    results.average,
                    this.baseline.documentFormatting[size].average
                );
                hasRegression = hasRegression || documentRegression;
            }
        }

        if (hasRegression) {
            throw new Error('Performance regression detected! Benchmark failed due to >25% performance degradation.');
        }
    }

    private comparePerformance(component: string, current: number, baseline: number, precision: number = 3): boolean {
        const ratio = current / baseline;
        const change = (ratio - 1) * 100;

        let isFailure: boolean = false;
        let message: string;

        if (ratio <= this.thresholds.improvement) {
            message = `🎉 ${component}: ${current.toFixed(precision)}ms vs baseline ${baseline.toFixed(precision)}ms (${Math.abs(change).toFixed(1)}% better)`;
        } else if (ratio >= this.thresholds.failure) {
            isFailure = true;
            message = `❌ ${component} FAILURE: ${current.toFixed(precision)}ms vs baseline ${baseline.toFixed(precision)}ms (${change.toFixed(1)}% slower)`;
        } else if (ratio >= this.thresholds.warning) {
            message = `⚠️  ${component}: ${current.toFixed(precision)}ms vs baseline ${baseline.toFixed(precision)}ms (${change.toFixed(1)}% slower)`;
        } else {
            message = `✅ ${component}: ${current.toFixed(precision)}ms vs baseline ${baseline.toFixed(precision)}ms (${change.toFixed(1)}% change)`;
        }

        console.log(message);
        return isFailure;
    }

    async loadTestFiles(): Promise<void> {
        const resourcesDir = path.resolve(__dirname, "resources/");
        const files = fs.readdirSync(resourcesDir);
        const distinctTests = getDistinctTestFileNames(files);

        for (const fileNameRoot of distinctTests) {
            // Determine file size based on content
            const inputPath = path.join(resourcesDir, `${fileNameRoot}-input.md`);
            if (fs.existsSync(inputPath)) {
                const content = fs.readFileSync(inputPath, 'utf-8');
                const size = this.categorizeFileSize(content);
                this.testFiles.push({ name: fileNameRoot, size });
            }
        }

        console.log(`Loaded ${this.testFiles.length} test files:`);
        const sizeGroups = this.testFiles.reduce((acc, file) => {
            acc[file.size] = (acc[file.size] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        console.log(`  Small: ${sizeGroups.small || 0}`);
        console.log(`  Medium: ${sizeGroups.medium || 0}`);
        console.log(`  Large: ${sizeGroups.large || 0}`);
    }

    private categorizeFileSize(content: string): 'small' | 'medium' | 'large' {
        const lines = content.split('\n').length;
        if (lines <= 20) return 'small';
        if (lines <= 50) return 'medium';
        return 'large';
    }

    async benchmarkFactoryCreation(iterations: number = 100000): Promise<void> {
        console.log('📦 Testing factory creation overhead...');
        
        // Warmup phase to mitigate JIT compilation effects
        console.log('   🔥 Warming up JIT compiler...');
        for (let i = 0; i < Math.min(10000, iterations / 10); i++) {
            getDocumentPrettyfier();
        }
        
        const times: number[] = [];
        const sectionStart = process.hrtime.bigint();

        for (let i = 0; i < iterations; i++) {
            const start = process.hrtime.bigint();
            getDocumentPrettyfier();
            const end = process.hrtime.bigint();
            times.push(Number(end - start) / 1_000_000); // Convert to milliseconds
        }

        const sectionEnd = process.hrtime.bigint();
        const totalDuration = Number(sectionEnd - sectionStart) / 1_000_000; // Convert to milliseconds

        // Remove outliers for more stable results
        const cleanTimes = this.removeOutliers(times);
        console.log(`   📊 Removed ${times.length - cleanTimes.length} outliers (${((times.length - cleanTimes.length) / times.length * 100).toFixed(1)}%)`);

        const average = cleanTimes.reduce((a, b) => a + b, 0) / cleanTimes.length;
        const standardDeviation = this.calculateStandardDeviation(cleanTimes);
        const confidenceInterval95 = this.calculateConfidenceInterval(cleanTimes);

        this.results.factoryCreation = {
            iterations,
            times: cleanTimes,
            average,
            median: this.calculateMedian(cleanTimes),
            min: Math.min(...cleanTimes),
            max: Math.max(...cleanTimes),
            standardDeviation,
            confidenceInterval95,
            totalDuration
        };
    }

    async benchmarkDocumentFormatting(): Promise<void> {
        console.log('📄 Testing document formatting by size...');
        
        const sizeGroups = this.testFiles.reduce((acc, file) => {
            if (!acc[file.size]) acc[file.size] = [];
            acc[file.size].push(file);
            return acc;
        }, {} as Record<string, typeof this.testFiles>);

        for (const [size, files] of Object.entries(sizeGroups)) {
            console.log(`   📋 Testing ${size} files...`);
            const iterations = this.getIterationsForSize(size as any);
            const times: number[] = [];
            
            // Create prettyfier once and reuse
            const prettyfier = getDocumentPrettyfier();
            
            // Warmup phase - process each file a few times
            console.log(`   🔥 Warming up with ${size} files...`);
            const warmupIterations = Math.min(50, Math.floor(iterations / 20));
            for (let i = 0; i < warmupIterations; i++) {
                const file = files[i % files.length];
                const document = await this.openDocument(`resources/${file.name}-input.md`);
                prettyfier.provideDocumentFormattingEdits(document, {} as any, {} as any);
            }
            
            const sectionStart = process.hrtime.bigint();

            for (let i = 0; i < iterations; i++) {
                const file = files[i % files.length];
                const document = await this.openDocument(`resources/${file.name}-input.md`);
                
                const start = process.hrtime.bigint();
                prettyfier.provideDocumentFormattingEdits(document, {} as any, {} as any);
                const end = process.hrtime.bigint();
                
                times.push(Number(end - start) / 1_000_000);
            }

            const sectionEnd = process.hrtime.bigint();
            const totalDuration = Number(sectionEnd - sectionStart) / 1_000_000; // Convert to milliseconds

            // Remove outliers for more stable results
            const cleanTimes = this.removeOutliers(times);
            console.log(`   📊 Removed ${times.length - cleanTimes.length} outliers (${((times.length - cleanTimes.length) / times.length * 100).toFixed(1)}%)`);

            const average = cleanTimes.reduce((a, b) => a + b, 0) / cleanTimes.length;
            const standardDeviation = this.calculateStandardDeviation(cleanTimes);
            const confidenceInterval95 = this.calculateConfidenceInterval(cleanTimes);

            this.results.documentFormatting[size] = {
                files: files.map(f => f.name),
                iterations,
                times: cleanTimes,
                average,
                median: this.calculateMedian(cleanTimes),
                min: Math.min(...cleanTimes),
                max: Math.max(...cleanTimes),
                standardDeviation,
                confidenceInterval95,
                totalDuration
            };
        }
    }

    private async openDocument(relativePath: string): Promise<vscode.TextDocument> {
        const fullPath = path.resolve(__dirname, relativePath);
        const uri = vscode.Uri.file(fullPath);
        return await vscode.workspace.openTextDocument(uri);
    }

    private getIterationsForSize(size: 'small' | 'medium' | 'large'): number {
        switch (size) {
            case 'small': return 25000;
            case 'medium': return 8000;
            case 'large': return 600;
            default: return 15000;
        }
    }

    private calculateMedian(times: number[]): number {
        const sorted = [...times].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0 
            ? (sorted[mid - 1] + sorted[mid]) / 2 
            : sorted[mid];
    }

    private removeOutliers(times: number[]): number[] {
        if (times.length < 10) return times; // Don't remove outliers from small datasets
        
        const sorted = [...times].sort((a, b) => a - b);
        const q1Index = Math.floor(sorted.length * 0.25);
        const q3Index = Math.floor(sorted.length * 0.75);
        const q1 = sorted[q1Index];
        const q3 = sorted[q3Index];
        const iqr = q3 - q1;
        
        // Use more conservative outlier detection (3x IQR instead of 1.5x)
        const lowerBound = q1 - 3 * iqr;
        const upperBound = q3 + 3 * iqr;
        
        return times.filter(time => time >= lowerBound && time <= upperBound);
    }

    private calculateStandardDeviation(times: number[]): number {
        const mean = times.reduce((a, b) => a + b, 0) / times.length;
        const squaredDeviations = times.map(time => Math.pow(time - mean, 2));
        const variance = squaredDeviations.reduce((a, b) => a + b, 0) / times.length;
        return Math.sqrt(variance);
    }

    private calculateConfidenceInterval(times: number[]): { lower: number; upper: number } {
        const mean = times.reduce((a, b) => a + b, 0) / times.length;
        const stdDev = this.calculateStandardDeviation(times);
        const standardError = stdDev / Math.sqrt(times.length);
        
        // 95% confidence interval using t-distribution approximation (1.96 for large samples)
        const marginOfError = 1.96 * standardError;
        
        return {
            lower: mean - marginOfError,
            upper: mean + marginOfError
        };
    }

    private calculateCoefficientOfVariation(times: number[]): number {
        const mean = times.reduce((a, b) => a + b, 0) / times.length;
        const stdDev = this.calculateStandardDeviation(times);
        return (stdDev / mean) * 100; // Return as percentage
    }

    private getStabilityRating(coefficientOfVariation: number): string {
        if (coefficientOfVariation <= 5) return '🟢 Excellent';
        if (coefficientOfVariation <= 10) return '🟡 Good';
        if (coefficientOfVariation <= 20) return '🟠 Fair';
        return '🔴 Poor';
    }

    async runFullBenchmark(): Promise<void> {
        console.log('🚀 Starting Performance Benchmark Suite');
        console.log(`\nUsing ${this.testFiles.length} real test files from system tests\n`);

        this.overallStartTime = process.hrtime.bigint();

        await this.benchmarkFactoryCreation();
        await this.benchmarkDocumentFormatting();

        const overallEnd = process.hrtime.bigint();
        this.results.overallDuration = Number(overallEnd - this.overallStartTime) / 1_000_000; // Convert to milliseconds

        this.printResults();
        this.saveResults();

        this.checkPerformanceRegression();
    }

    private printResults(): void {
        console.log('\n' + '='.repeat(100));
        console.log('📊 PERFORMANCE BENCHMARK RESULTS');
        console.log('='.repeat(100));

        // Factory creation results
        const factory = this.results.factoryCreation;
        const factoryCv = this.calculateCoefficientOfVariation(factory.times);
        console.log(`\n🎯 Factory Creation:`);
        console.log(`   Iterations: ${factory.iterations}`);
        console.log(`   Average: ${factory.average.toFixed(6)}ms ± ${factory.standardDeviation.toFixed(6)}ms`);
        console.log(`   Median:  ${factory.median.toFixed(6)}ms`);
        console.log(`   95% CI:  [${factory.confidenceInterval95.lower.toFixed(6)}, ${factory.confidenceInterval95.upper.toFixed(6)}]ms`);
        console.log(`   Range:   [${factory.min.toFixed(6)}, ${factory.max.toFixed(6)}]ms`);
        console.log(`   Stability: ${factoryCv.toFixed(1)}% CV ${this.getStabilityRating(factoryCv)}`);
        console.log(`   Total Duration: ${factory.totalDuration.toFixed(3)}ms`);

        // Document formatting results
        for (const [size, results] of Object.entries(this.results.documentFormatting)) {
            const cv = this.calculateCoefficientOfVariation(results.times);
            console.log(`\n🎯 Document Formatting (${size}):`);
            const fileList = results.files.length <= 3 
                ? results.files.join(', ')
                : `${results.files.slice(0, 3).join(', ')}...`;
            console.log(`   Test files: ${results.files.length} files (${fileList})`);
            console.log(`   Iterations: ${results.iterations}`);
            console.log(`   Average: ${results.average.toFixed(3)}ms ± ${results.standardDeviation.toFixed(3)}ms`);
            console.log(`   Median:  ${results.median.toFixed(3)}ms`);
            console.log(`   95% CI:  [${results.confidenceInterval95.lower.toFixed(3)}, ${results.confidenceInterval95.upper.toFixed(3)}]ms`);
            console.log(`   Range:   [${results.min.toFixed(3)}, ${results.max.toFixed(3)}]ms`);
            console.log(`   Stability: ${cv.toFixed(1)}% CV ${this.getStabilityRating(cv)}`);
            console.log(`   Total Duration: ${results.totalDuration.toFixed(3)}ms`);
        }

        console.log('\n' + '='.repeat(100));
        console.log(`⏱️  OVERALL BENCHMARK DURATION: ${this.results.overallDuration.toFixed(3)}ms`);
        console.log('='.repeat(100));
        console.log('💡 TIPS FOR CONSISTENT BENCHMARKING:');
        console.log('   • Close other applications to reduce system interference');
        console.log('   • Run multiple times and compare confidence intervals');
        console.log('   • Look for CV (Coefficient of Variation) < 10% for reliable measurements');
        console.log('   • Focus on trends across multiple runs rather than absolute values');
        console.log('='.repeat(100));
    }

    private saveResults(): void {
        // Skip file creation in CI environments
        const isCI = process.env.CI || process.env.GITHUB_ACTIONS;
        if (isCI) {
            console.log('\n📊 Running in CI - skipping file creation');
            return;
        }

        const fileName = `benchmark-results-${this.results.timestamp.replace(/[:.]/g, '-')}.json`;
        const filePath = path.resolve(__dirname, '../../..', fileName);
        
        // Create a copy of results without the "times" arrays
        const resultsToSave = {
            ...this.results,
            factoryCreation: {
                ...this.results.factoryCreation,
                times: undefined // Exclude times array
            },
            documentFormatting: Object.fromEntries(
                Object.entries(this.results.documentFormatting).map(([size, data]) => [
                    size,
                    {
                        ...data,
                        times: undefined // Exclude times arrays
                    }
                ])
            )
        };
        
        fs.writeFileSync(filePath, JSON.stringify(resultsToSave, null, 2));
        console.log(`\n💾 Results saved to: ${fileName}`);
    }
}

// Standalone benchmark runner
async function runBenchmark() {
    const benchmark = new PerformanceBenchmark();
    await benchmark.loadTestFiles();
    await benchmark.runFullBenchmark();
}

// Export for potential use in other contexts
export { PerformanceBenchmark, runBenchmark };

// VS Code test runner entry point (for benchmark-only execution)
export async function run(): Promise<void> {
    console.log('Starting VS Code Performance Benchmark...\n');
    try {
        await runBenchmark();
        console.log('\n✅ Benchmark completed successfully!');
    } catch (error) {
        console.error('\n❌ Benchmark failed:', error);
        throw error;
    }
}
