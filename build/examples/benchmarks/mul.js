var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * benchmark a circuit filled with generic gates
 */
import { Circuit, Field, Provable, circuitMain, ZkProgram } from 'o1js';
import { tic, toc } from '../utils/tic-toc.node.js';
// parameters
let nMuls = (1 << 16) + (1 << 15); // not quite 2^17 generic gates = not quite 2^16 rows
let withPickles = true;
// the circuit: multiply a number with itself n times
let xConst = Field.random();
function main(nMuls) {
    let x = Provable.witness(Field, () => xConst);
    let z = x;
    for (let i = 0; i < nMuls; i++) {
        z = z.mul(x);
    }
}
async function getRows(nMuls) {
    let { rows } = await Provable.constraintSystem(() => main(nMuls));
    return rows;
}
function simpleKimchiCircuit(nMuls) {
    class MulChain extends Circuit {
        static run() {
            main(nMuls);
        }
    }
    __decorate([
        circuitMain,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], MulChain, "run", null);
    return MulChain;
}
function picklesCircuit(nMuls) {
    return ZkProgram({
        name: 'mul-chain',
        methods: {
            run: {
                privateInputs: [],
                async method() {
                    main(nMuls);
                },
            },
        },
    });
}
console.log('circuit size (without pickles overhead)', await getRows(nMuls));
if (withPickles) {
    let circuit = picklesCircuit(nMuls);
    tic('compile 1 (includes srs creation)');
    await circuit.compile();
    toc();
    tic('compile 2');
    await circuit.compile();
    toc();
    tic('prove');
    let p = await circuit.run();
    toc();
    tic('verify');
    let ok = await circuit.verify(p);
    toc();
    if (!ok)
        throw Error('invalid proof');
}
else {
    let circuit = simpleKimchiCircuit(nMuls);
    tic('compile 1 (includes srs creation)');
    let kp = await circuit.generateKeypair();
    toc();
    tic('compile 2');
    kp = await circuit.generateKeypair();
    toc();
    tic('prove');
    let p = await circuit.prove([], [], kp);
    toc();
    tic('verify');
    let ok = await circuit.verify([], kp.verificationKey(), p);
    toc();
    if (!ok)
        throw Error('invalid proof');
}
//# sourceMappingURL=mul.js.map