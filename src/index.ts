import * as fs from "fs";
import { tree } from "./tree";
import { Booking, Solution } from "./types";

if (process.argv[2] === "help") {
    console.info("Enter arguments in the format 'npm start <input file location> <output file location>'");
    console.info("If no args are provided defaults will be used");
    process.exit(0);
}

const defaultInputLocation = "data/bookings.json";
const defaultOutputLocation = "results.json";
const inputFileLocation = process.argv[2];
const outputFileLocation = process.argv[3];

if (inputFileLocation) {
    console.warn(`No input file location provided, defaulting to ${defaultInputLocation}`);
}
if (outputFileLocation) {
    console.warn(`No output file location provided, defaulting to ${defaultOutputLocation}`);
}

let data: Booking[] = [];

try {
    data = JSON.parse(fs.readFileSync(inputFileLocation ||  defaultInputLocation, "utf8"));
} catch (error) {
    console.error(error.message);
    process.exit(1);
}

// const solution: Solution = brute(data);
const solution: Solution = tree(data);
console.debug(`Min relocations: ${solution.relocations}`);
console.debug(`Optimal bookings: ${JSON.stringify(solution.bookingSet)}`);
writeToFile(solution.bookingSet);

function writeToFile(bookings: Booking[]) {
    fs.writeFileSync(outputFileLocation || defaultOutputLocation,
        JSON.stringify(bookings.map((booking) => booking.id)));
}
