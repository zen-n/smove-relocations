import { Booking, Solution } from "./types";
import { IGenerator, permutation } from "js-combinatorics";

/**
 * Reduce the number of relocations for a set of bookings using a brute force/permutations strategy.
 * O(n!) time complexity
 * @param bookings unoptimised array of bookings
 * @returns a solution containing an optimal set of bookings and the number of relocations
 */
export function brute(bookings: Booking[]): Solution {
    const permutations: IGenerator<Booking[]> = permutation(bookings, bookings.length);
    let optimalBookings: Booking[];
    let minRelocations = Number.MAX_SAFE_INTEGER;
    permutations.forEach((bookingSet) => {
        const relocations = calculateRelocations(bookingSet);
        if (relocations < minRelocations) {
            optimalBookings = bookingSet;
            minRelocations = relocations;
        }
    });
    return {bookingSet: optimalBookings, relocations: minRelocations};
}

function calculateRelocations(bookings: Booking[]){
    let relocations = 0;
    for (let i = 0; i < bookings.length - 1; i++) {
        if (bookings[i].end !== bookings[i+1].start){
            relocations += 1;
        } 
    }
    return relocations;
}