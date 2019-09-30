# Smove booking ordering challenge

This is a submission for the [smove booking ordering challenge](https://github.com/itatsmove/smovechallenge/blob/master/challenges/bookingordering.md). The short version of this challenge is: given a list of bookings with start/end points, order the bookings to reduce the number of relocations required between bookings.

## Getting started
### Prerequisites
- NodeJS (tested on  v10.15, but any ES6 compatible version should work 🤞)
### Install
1. Clone this repo `git clone https://github.com/zenonc3/smove-relocations.git`
2. Run `npm install` in the main directory of the project
### Run
1. `npm start <input file location> <output file location>`
### Test
Note that the test suite only covers the tree traversal strategy 
1. `npm test`

## Ramblings
I decided to pick off this challenge as it looked kinda fun since I don't really get to do these kind of puzzle style questions in my usual work. I had mild regret 2 hours into this as I realized it was more complex than I really wanted it to be but I was half expecting this ⚰🤕.

### Algorithms
#### Brute
My first cut - just a baseline/sanity check than a real implementation. Check every permutation and pick the one with the lowest relocations. This implementation is disabled out of the box, but can be enabled by un-commenting `const solution = brute(data);` in `index.ts`

This fell apart quickly. It has a worst case time complexity of `O(n!)` (where `n` is the number of bookings). Space complexity remained at `O(n)` because the permutations are generated iteratively.

#### Tree traversal
This models possible combinations of the bookings as a tree structure. This reduces the amount of repeated operations, since nodes closer to the ends share common branches.

Worst case time complexity is `O(m^(n+1))` (where `n` is the number of bookings and `m` is the average number of end locations per start location). Space complexity is `O(n)` as the implementation is depth first.

Tweaks to reduce the chance of hitting the worst case in practice:
 - Branches get pruned once too many relocations happen in a proposed sequence
 - Greedy style traversal, where future bookings that have zero cost (no relocations) get traversed first

 #### Other optimizations/improvements that I haven't done
- Use worker threads - allows for parallel execution, but would also allow for timeouts so we can return the best solution _currently_ found. Even for large numbers of bookings, we can find a better-than-random but non-optimal solution pretty quickly so it would be useful to return.
- Deep cloning the object arrays eats up a lot of time, this data structure could be simplified
- Filter non-unique bookings
- The way the recursive function returns the solution is not intuitive