import * as assert from 'assert';
import { AlignmentMarkerStrategy, IAlignmentMarker } from '../../../../src/viewModelFactories/alignmentMarking';
import { Alignment } from '../../../../src/models/alignment';

suite("AlignmentMarkerStrategy tests", () => {

    test("markerFor() returns a different marker strategy for the different alignemnts", () => {
        const sut = new AlignmentMarkerStrategy(":");
        const alignments = [ Alignment.NotSet, Alignment.Left, Alignment.Center, Alignment.Right ];

        const markers: IAlignmentMarker[] = alignments.map(sut.markerFor, sut);

        const distinctMarkers = markers.filter((v, i, a) => a.indexOf(v) == i);

        assert.strictEqual(distinctMarkers.length, markers.length);
    });

});