import { CurveParams, Pallas, Vesta } from './elliptic-curve.js';
import { exampleFields } from './finite-field-examples.js';

export { CurveParams };

const secp256k1Params: CurveParams = {
  name: 'secp256k1',
  modulus: exampleFields.secp256k1.modulus,
  order: exampleFields.secq256k1.modulus,
  a: 0n,
  b: 7n,
  generator: {
    x: 0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798n,
    y: 0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8n,
  },
};

const pallasParams: CurveParams = {
  name: 'Pallas',
  modulus: Pallas.modulus,
  order: Pallas.order,
  a: Pallas.a,
  b: Pallas.b,
  generator: Pallas.one,
  endoBase: Pallas.endoBase,
  endoScalar: Pallas.endoScalar,
};

const vestaParams: CurveParams = {
  name: 'Vesta',
  modulus: Vesta.modulus,
  order: Vesta.order,
  a: Vesta.a,
  b: Vesta.b,
  generator: Vesta.one,
  endoBase: Vesta.endoBase,
  endoScalar: Vesta.endoScalar,
};

const CurveParams = {
  Secp256k1: secp256k1Params,
  Pallas: pallasParams,
  Vesta: vestaParams,
};
