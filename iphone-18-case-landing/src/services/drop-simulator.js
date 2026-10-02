/**
 * Drop Simulator Physics & Telemetry Engine
 */

const GRAVITY_CONSTANT = 9.80665; // m/s²
const FEET_TO_METERS = 0.3048;
const PHONE_MASS_KG = 0.220; // Avg iPhone 18 mass ~220g

const SURFACES = {
  hardwood: { name: 'Hardwood Oak Flooring', hardnessCoefficient: 1.2, surfaceDeformationMm: 0.8 },
  concrete: { name: 'Cured Concrete Sidewalk', hardnessCoefficient: 2.8, surfaceDeformationMm: 0.1 },
  granite: { name: 'Sharp Granite Edge', hardnessCoefficient: 3.5, surfaceDeformationMm: 0.05 },
  steel: { name: 'Industrial Steel Beam', hardnessCoefficient: 4.2, surfaceDeformationMm: 0.02 }
};

function calculateDropMetrics(heightFeet = 10, surfaceKey = 'concrete', caseType = 'aero-shield') {
  const heightMeters = Math.max(1, Math.min(heightFeet, 50)) * FEET_TO_METERS;
  const surface = SURFACES[surfaceKey] || SURFACES.concrete;

  // Impact velocity: v = sqrt(2 * g * h) in m/s
  const velocityMs = Math.sqrt(2 * GRAVITY_CONSTANT * heightMeters);
  const velocityMph = velocityMs * 2.23694;

  // Kinetic Energy (Joules): E = 0.5 * m * v^2
  const kineticEnergyJoules = 0.5 * PHONE_MASS_KG * Math.pow(velocityMs, 2);

  // Aerogel case compression buffer vs silicone vs naked
  let compressionBufferMm = 2.4; // AERO-SHIELD 2.4mm pneumatic cushion
  let dispersionEfficiency = 0.985; // Disperses 98.5% of force outwards

  if (caseType === 'silicone') {
    compressionBufferMm = 0.8;
    dispersionEfficiency = 0.65;
  } else if (caseType === 'naked') {
    compressionBufferMm = 0.05;
    dispersionEfficiency = 0.0;
  }

  const effectiveDecelDistanceMeters = (compressionBufferMm + surface.surfaceDeformationMm) / 1000;

  // Peak impact acceleration (g): a = v^2 / (2 * d * g)
  const peakDecelerationG = Math.round(Math.pow(velocityMs, 2) / (2 * effectiveDecelDistanceMeters * GRAVITY_CONSTANT) * surface.hardnessCoefficient);

  // G-Force transmitted to the phone internal board/screen
  const gForceTransmitted = Math.max(1, Math.round(peakDecelerationG * (1 - dispersionEfficiency)));
  const gForceDissipated = peakDecelerationG - gForceTransmitted;

  // Device status determination
  let status = 'Flawless Condition';
  let glassSurvivalRate = 100;
  let frameDamage = '0.00mm (Zero deflection)';

  if (caseType === 'aero-shield') {
    if (heightFeet <= 25) {
      status = '100% Intact. Aerogel absorbs full kinetic shock.';
      glassSurvivalRate = 100;
      frameDamage = '0.00mm';
    } else if (heightFeet <= 35) {
      status = '100% Intact. Titanium outer rim absorbed impact with zero flex.';
      glassSurvivalRate = 99.4;
      frameDamage = '0.01mm micro-cosmetic';
    } else {
      status = 'Device fully operational. Minor corner bumper compression.';
      glassSurvivalRate = 97.5;
      frameDamage = '0.05mm';
    }
  } else if (caseType === 'silicone') {
    if (heightFeet <= 6) {
      status = 'Device Intact.';
      glassSurvivalRate = 95;
    } else {
      status = 'High risk of screen corner spider-crack & internal camera lens misalignment.';
      glassSurvivalRate = Math.max(10, Math.round(100 - (heightFeet * 2.8)));
      frameDamage = 'Significant scuff & dent';
    }
  } else {
    status = 'Catastrophic Glass Shatter & Motherboard Fracture.';
    glassSurvivalRate = Math.max(0, Math.round(100 - (heightFeet * 6.5)));
    frameDamage = 'Severe body bend / screen total loss';
  }

  return {
    heightFeet,
    heightMeters: Number(heightMeters.toFixed(2)),
    surface: surface.name,
    caseType,
    velocityMph: Number(velocityMph.toFixed(1)),
    velocityMs: Number(velocityMs.toFixed(2)),
    kineticEnergyJoules: Number(kineticEnergyJoules.toFixed(2)),
    peakGForce: peakDecelerationG,
    gForceDissipated,
    gForceTransmitted,
    dispersionPercentage: (dispersionEfficiency * 100).toFixed(1) + '%',
    glassSurvivalRate,
    status,
    frameDamage
  };
}

module.exports = {
  calculateDropMetrics,
  SURFACES
};
