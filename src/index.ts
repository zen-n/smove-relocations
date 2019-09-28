import * as fs from 'fs';
import { Booking, Solution } from './types';
import { brute } from './brute';

let data: Booking[] =[];

try{
     data = JSON.parse(fs.readFileSync('data/bookings-simple.json', 'utf8'));
} catch (error) {
    console.error(error.message);
    process.exit(1);
}

const solution: Solution = brute(data);
console.log(`Min relocations: ${solution.relocations}`);
console.log(`Optimal bookings: ${JSON.stringify(solution.bookingSet)}`);
writeToFile(solution.bookingSet);


function writeToFile(bookings: Booking[]){
    fs.writeFileSync('results.json', JSON.stringify(bookings.map((booking) => booking.id)));
}

