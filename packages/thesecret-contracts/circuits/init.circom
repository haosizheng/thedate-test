/*
    Prove: I know (x1,y1,x2,y2,p2,r2,distMax) such that:
    - x2^2 + y2^2 <= r^2
    - perlin(x2, y2) = p2
    - (x1-x2)^2 + (y1-y2)^2 <= distMax^2
    - MiMCSponge(x1,y1) = pub1
    - MiMCSponge(x2,y2) = pub2
*/

template Multiplier() {
   signal private input a;
   signal private input b;
   signal output c;
   c <== a*b;
}

component main = Multiplier();

