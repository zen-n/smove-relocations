import * as fs from 'fs';
import { Booking, Solution } from './types';
import { tree } from './tree';

let data: Booking[] =[];

try{
     data = JSON.parse(fs.readFileSync('data/bookings.json', 'utf8'));
} catch (error) {
    console.error(error.message);
    process.exit(1);
}

// const solution: Solution = brute(data);
const solution: Solution = tree(data);
console.debug(`Min relocations: ${solution.relocations}`);
console.debug(`Optimal bookings: ${JSON.stringify(solution.bookingSet)}`);
writeToFile(solution.bookingSet);


function writeToFile(bookings: Booking[]){
    fs.writeFileSync('results.json', JSON.stringify(bookings.map((booking) => booking.id)));
}