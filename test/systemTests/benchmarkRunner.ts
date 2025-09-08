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
        factoryCreation: { average: 0.0001675, median: 0.0001522 },
        documentFormatting: {
            small: { average: 0.1429, median: 0.1162 },
            medium: { average: 0.2358, median: 0.2186 },
            large: { average: 4.2929, median: 2.2453 }
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

        this.results.factoryCreation = {
            iterations,
            times,
            average: times.reduce((a, b) => a + b, 0) / times.length,
            median: this.calculateMedian(times),
            min: Math.min(...times),
            max: Math.max(...times),
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
            const iterations = this.getIterationsForSize(size as any);
            const times: number[] = [];
            const prettyfier = getDocumentPrettyfier();
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

            this.results.documentFormatting[size] = {
                files: files.map(f => f.name),
                iterations,
                times,
                average: times.reduce((a, b) => a + b, 0) / times.length,
                median: this.calculateMedian(times),
                min: Math.min(...times),
                max: Math.max(...times),
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
            case 'small': return 15000;
            case 'medium': return 10000;
            case 'large': return 750;
            default: return 10000;
        }
    }

    private calculateMedian(times: number[]): number {
        const sorted = [...times].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0 
            ? (sorted[mid - 1] + sorted[mid]) / 2 
            : sorted[mid];
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
        console.log(`\n🎯 Factory Creation:`);
        console.log(`   Iterations: ${factory.iterations}`);
        console.log(`   Average: ${factory.average.toFixed(3)}ms`);
        console.log(`   Median:  ${factory.median.toFixed(3)}ms`);
        console.log(`   Min:     ${factory.min.toFixed(3)}ms`);
        console.log(`   Max:     ${factory.max.toFixed(3)}ms`);
        console.log(`   Total Duration: ${factory.totalDuration.toFixed(3)}ms`);

        // Document formatting results
        for (const [size, results] of Object.entries(this.results.documentFormatting)) {
            console.log(`\n🎯 Document Formatting (${size}):`);
            const fileList = results.files.length <= 3 
                ? results.files.join(', ')
                : `${results.files.slice(0, 3).join(', ')}...`;
            console.log(`   Test files: ${results.files.length} files (${fileList})`);
            console.log(`   Iterations: ${results.iterations}`);
            console.log(`   Average: ${results.average.toFixed(3)}ms`);
            console.log(`   Median:  ${results.median.toFixed(3)}ms`);
            console.log(`   Min:     ${results.min.toFixed(3)}ms`);
            console.log(`   Max:     ${results.max.toFixed(3)}ms`);
            console.log(`   Total Duration: ${results.totalDuration.toFixed(3)}ms`);
        }

        console.log('\n' + '='.repeat(100));
        console.log(`⏱️  OVERALL BENCHMARK DURATION: ${this.results.overallDuration.toFixed(3)}ms`);
        console.log('='.repeat(100));
        console.log('💡 TIP: Run this benchmark before and after code changes to measure improvements!');
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
