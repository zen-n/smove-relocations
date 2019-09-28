import { Booking, Solution } from "./types";
import { IGenerator } from "js-combinatorics";

export function brute(bookings: Booking[]): Solution{
    const permutations: IGenerator<Booking[]> = comb.permutation(bookings, 6);
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