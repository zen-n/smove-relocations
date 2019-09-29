import { Booking, StartEndMap, Solution } from "./types";

export function tree(bookings: Booking[]): Solution {
    const map = transformToStartEndMap(bookings);
    const optimalSolution: Solution = {bookingSet: [], relocations: Number.MAX_SAFE_INTEGER };
    traverse(deepClone(map), [], -1, optimalSolution);
    return {bookingSet: optimalSolution.bookingSet, relocations: optimalSolution.relocations};
}

function traverse (map: StartEndMap, currentBookings: Booking[], currentRelocations: number, optimalSolution: Solution): void {
    // If the solution is already worse than the the currently existing one, bail
    if (currentRelocations >= optimalSolution.relocations){
        return;
    }

    // This is the end condition - when there are no more bookings to add
    if (Object.keys(map).length === 0) {
        if (currentRelocations < optimalSolution.relocations){
            optimalSolution.relocations = currentRelocations;
            optimalSolution.bookingSet = currentBookings;
        }
        return;
    }

    const lastBooking = currentBookings[currentBookings.length - 1];
    const lastLocation = lastBooking ? lastBooking.end : undefined;

    // Sneak locations that are likely to have zero cost up to the front ;)
    const startLocations = Object.keys(map);
    // startLocations.splice(startLocations.indexOf(lastLocation), 1);
    if (map[lastLocation]) startLocations.unshift(lastLocation);

    for (let bookIdx = 0; bookIdx < startLocations.length; bookIdx++){
        const location = startLocations[bookIdx];
        if (bookIdx! == 0 && location === lastLocation) continue;
        // console.log(location);
        for (let locIdx = 0; locIdx <  map[location].length; locIdx++){
            const nextBooking = map[location][locIdx]
            const newMap = deepClone(map);
            // Remove the booking that we have just used
            newMap[location].splice(locIdx, 1);
            if (newMap[location].length === 0) {
                // console.log("dele loc" + location);
                delete newMap[location];
            }
            traverse(newMap,
                     currentBookings.concat(nextBooking),
                     nextBooking.start === lastLocation ? currentRelocations : currentRelocations + 1,
                     optimalSolution);
        }
    }
}

function transformToStartEndMap(bookings: Booking[]): StartEndMap {
    const map: StartEndMap = {};
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

function deepClone<T>(data: T): T{
    // This clone is a bit yuck, but there are no functions or dates or anything 
    // particularly interesting inside the maps so we can get away with it
    return JSON.parse(JSON.stringify(data));
}