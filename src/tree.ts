import { Booking, StartIndex, Solution } from "./types";

/**
 * Reduce the number of relocations for a set of bookings using a tree traversal strategy
 * with some added optimisations. O(m^n) worst case time complexity.
 * @param bookings unoptimised array of bookings
 * @returns a solution containing an optimal set of bookings and the number of relocations
 */
export function tree(bookings: Booking[]): Solution {
    console.debug("Searching for solution use tree strategy...");
    const map = transformToStartEndMap(bookings);
    const optimalSolution: Solution = {bookingSet: [], relocations: Number.MAX_SAFE_INTEGER };
    traverse(deepClone(map), [], -1, optimalSolution);
    return {bookingSet: optimalSolution.bookingSet, relocations: optimalSolution.relocations};
}

/**
 * Models possible booking sets as a tree, and traverses it to find a valid outcome with minimal relocations
 * @param remainingBookings map-like structure used to index the start locations and serve as a list of unallocated bookings.
 *                          This should not be shared between function calls
 * @param currentBookings current proposed booking set. This should not be shared between function calls
 * @param currentRelocations number of relocations for proposed booking set. This should not be shared between function calls
 * @param optimalSolution reference to the current optimal solution  shared by all members of the traverse call stack
 */
function traverse (remainingBookings: StartIndex, currentBookings: Booking[], currentRelocations: number, optimalSolution: Solution): void {
    // If the solution is not better than the the currently existing one, bail
    if (currentRelocations >= optimalSolution.relocations){
        return;
    }

    // This is the end condition - when there are no more bookings to add
    if (Object.keys(remainingBookings).length === 0) {
        console.debug(`Solution found with ${currentRelocations} relocations`);
        if (currentRelocations < optimalSolution.relocations) {
            optimalSolution.relocations = currentRelocations;
            optimalSolution.bookingSet = currentBookings;
        }
        return;
    }

    const lastBooking = currentBookings[currentBookings.length - 1];
    const lastLocation = lastBooking ? lastBooking.end : undefined;

    // Sneak locations that are likely to have zero cost up to the front
    const startLocations = Object.keys(remainingBookings);
    if (remainingBookings[lastLocation]) {
        startLocations.unshift(lastLocation);
    }

    for (let bookIdx = 0; bookIdx < startLocations.length; bookIdx++){
        const location = startLocations[bookIdx];
        if (bookIdx! == 0 && location === lastLocation) {
            continue;
        }

        for (let locIdx = 0; locIdx <  remainingBookings[location].length; locIdx++){
            const nextBooking = remainingBookings[location][locIdx]
            const nextRemainingBookings = deepClone(remainingBookings);

            // Remove the booking that we have just used
            nextRemainingBookings[location].splice(locIdx, 1);
            if (nextRemainingBookings[location].length === 0) {
                delete nextRemainingBookings[location];
            }
            traverse(nextRemainingBookings,
                     currentBookings.concat(nextBooking),
                     nextBooking.start === lastLocation ? currentRelocations : currentRelocations + 1,
                     optimalSolution);
        }
    }
}

function transformToStartEndMap(bookings: Booking[]): StartIndex {
    const map: StartIndex = {};
    bookings.forEach((booking) => {
        const start = map[booking.start];
        if (start){
            start.push(booking);
        } else {
            map[booking.start] = [booking];
        }
    });
    return map;
}

function deepClone(data: any): any {
    const newObj: any = {};
    Object.keys(data).forEach((key) => {
        newObj[key] = [...data[key]];
    });
    return newObj;
}