const SignupService = require('../src/services/signupService');
const { db } = require('../src/db');

describe('CheckIn Workflow', () => {
  beforeEach(() => {
    db.clearAll();
  });

  test('successfully checks in student using plain pass code', async () => {
    const reg = await SignupService.registerStudent({
      fullName: 'Lyoto Machida',
      email: 'lyoto@example.com',
      phone: '555-444-3333',
      discipline: 'karate',
      program: 'starter-pass',
      waiverAccepted: true
    });

    const passCode = reg.signup.passCode;
    const checkInResult = await SignupService.checkInStudent(passCode);

    expect(checkInResult.success).toBe(true);
    expect(checkInResult.student.status).toBe('checked_in');
    expect(checkInResult.student.checkInCount).toBe(1);
    expect(checkInResult.student.lastCheckInAt).toBeDefined();

    // Check again to test increment
    const secondCheckIn = await SignupService.checkInStudent(passCode);
    expect(secondCheckIn.student.checkInCount).toBe(2);
  });

  test('successfully checks in student using scanned QR JSON payload', async () => {
    const reg = await SignupService.registerStudent({
      fullName: 'Khabib Nurmagomedov',
      email: 'khabib@example.com',
      phone: '555-777-8888',
      discipline: 'mma',
      program: 'monthly-unlimited',
      waiverAccepted: true
    });

    const qrPayload = JSON.stringify({
      type: 'MARTIAL_ARTS_PASS',
      code: reg.signup.passCode,
      id: reg.signup.id,
      name: reg.signup.fullName
    });

    const checkInResult = await SignupService.checkInStudent(qrPayload);
    expect(checkInResult.success).toBe(true);
    expect(checkInResult.student.fullName).toBe('Khabib Nurmagomedov');
    expect(checkInResult.student.status).toBe('checked_in');
  });

  test('throws 404 error when pass code does not exist', async () => {
    await expect(SignupService.checkInStudent('INVALID-9999'))
      .rejects
      .toMatchObject({ statusCode: 404 });
  });
});
