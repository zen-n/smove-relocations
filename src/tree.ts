import { Booking, Solution, StartIndex } from "./types";

/**
 * Reduce the number of relocations for a set of bookings using a tree traversal strategy
 * with some added optimizations. O(m^n) worst case time complexity.
 * @param bookings un-optimized array of bookings
 * @returns a solution containing an optimal set of bookings and the number of relocations
 *          -1 relocations indicates that no solution was found
 */
export function tree(bookings: Booking[]): Solution {
    console.debug("Searching for solution use tree strategy...");
    const startIndex = generateStartIndex(bookings);
    const optimalSolution: Solution = {bookingSet: [], relocations: Number.MAX_SAFE_INTEGER };
    traverse(cloneIndex(startIndex), [], -1, optimalSolution);
    return {bookingSet: optimalSolution.bookingSet, relocations: optimalSolution.relocations};
}

/**
 * Models possible booking sets as a tree, and traverses it to find a valid outcome with minimal relocations
 * @param remainingBookings used to index the start locations and serve as a list of unallocated bookings.
 *                          This should not be shared between function calls
 * @param currentBookings current proposed booking set. This should not be shared between function calls
 * @param currentRelocations number of relocations for proposed booking set. Should not be shared between function calls
 * @param optimalSolution reference to the current optimal solution  shared by all members of the traverse call stack
 */
function traverse(remainingBookings: StartIndex, currentBookings: Booking[],
                  currentRelocations: number, optimalSolution: Solution): void {
    // If the solution is not better than the the currently existing one, bail
    if (currentRelocations >= optimalSolution.relocations) {
        return;
    }

    // This is the end condition - when there are no more bookings to add
    if (Object.keys(remainingBookings).length === 0) {
        console.debug(`Solution found with ${currentRelocations} relocations`);
        console.debug(`Solution found is ${JSON.stringify(currentBookings)}`);
        console.debug("Continuing to search...");
        optimalSolution.relocations = currentRelocations;
        optimalSolution.bookingSet = currentBookings;
        return;
    }

    const lastBooking = currentBookings[currentBookings.length - 1];
    const lastLocation = lastBooking ? lastBooking.end : undefined;

    // Sneak locations that  have zero cost up to the front
    const startLocations = Object.keys(remainingBookings);
    if (remainingBookings[lastLocation]) {
        startLocations.unshift(lastLocation);
    }

    for (let bookIdx = 0; bookIdx < startLocations.length; bookIdx++) {
        const location = startLocations[bookIdx];

        // We will come across the location we pushed to the front again because we haven't deleted it
        if (bookIdx !== 0 && location === lastLocation) {
            continue;
        }

        for (let locIdx = 0; locIdx <  remainingBookings[location].length; locIdx++) {
            const nextBooking = remainingBookings[location][locIdx];
            const nextRemainingBookings = cloneIndex(remainingBookings);

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

function generateStartIndex(bookings: Booking[]): StartIndex {
    const index: StartIndex = {};
    bookings.forEach((booking) => {
        const start = index[booking.start];
        if (start) {
            start.push(booking);
        } else {
            index[booking.start] = [booking];
        }
    });
    return index;
}

function cloneIndex(data: any): any {
    const newObj: any = {};
    Object.keys(data).forEach((key) => {
        newObj[key] = [...data[key]];
    });
    return newObj;
}
