import { Booking, Solution } from "../types";
import { tree } from "../tree";

describe("Minimise booking relocations using the tree strategy", () => {
    it("should return a valid solution given a single booking", () => {
        const bookings: Booking[] = [{id: 1, start: "a", end: "b"}];
        const solution: Solution = tree(bookings);

        expect(solution).toEqual({bookingSet: [{id: 1, start: "a", end: "b"}], relocations: 0});
    });

    it("should return an empty solution with -1 relocations given no bookings", () => {
        const bookings: Booking[] = [];
        const solution: Solution = tree(bookings);

        expect(solution).toEqual({bookingSet: [], relocations: -1});
    });

    it("should return a valid solution given there are multiple bookings", () => {
        const bookings: Booking[] = [{id: 1, start: "a", end: "b"}, {id: 2, start: "c", end: "a"},
                                     {id: 3, start: "a", end: "c"}];
        const solution: Solution = tree(bookings);

        expect(solution).toEqual({bookingSet: [{id: 3, start: "a", end: "c"}, {id: 2, start: "c", end: "a"}, 
                                               {id: 1, start: "a", end: "b"}], relocations: 0});
    });

    it("should return a single valid solution given multiple possible solutions with the same cost", () => {
        const bookings: Booking[] = [{id: 1, start: "a", end: "b"}, {id: 2, start: "c", end: "a"},
                                     {id: 3, start: "b", end: "c"}];
        const solution: Solution = tree(bookings);

        expect(solution).toEqual({bookingSet: [{id: 1, start: "a", end: "b"}, {id: 3, start: "b", end: "c"}, 
                                               {id: 2, start: "c", end: "a"}], relocations: 0});
    });

    it("should return a valid solution where a relocation must be made", () => {
        const bookings: Booking[] = [{id: 1, start: "a", end: "c"}, {id: 2, start: "c", end: "a"},
                                     {id: 3, start: "b", end: "c"}, {id: 4, start: "b", end: "c"}];
        const solution: Solution = tree(bookings);

        expect(solution).toEqual({bookingSet: [{id: 3, start: "b", end: "c"}, {id: 2, start: "c", end: "a"},
                                               {id: 1, start: "a", end: "c"}, {id: 4, start: "b", end: "c"}],
                                               relocations: 1});
    });
});