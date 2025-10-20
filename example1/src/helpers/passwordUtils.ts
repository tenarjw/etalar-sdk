// Password strengths:
//https://gist.github.com/leewinder/a1f6bc5100fc2573b47bb2e0b7937f34


// Object to check password strengths and various properties
export class PasswordCheckService {

  // Expected length of all passwords
  public static get MinimumLength(): number {
      return 8;
  }

  // Regex to check for a common password string - all based on 5+ length passwords
  private commonPasswordPatterns = /passw.*|12345.*|09876.*|qwert.*|asdfg.*|zxcvb.*|footb.*|baseb.*|drago.*/;

  //
  // Checks if the given password matches a set of common password
  //
  public isPasswordCommon(password: string): boolean {
      return this.commonPasswordPatterns.test(password);
  }

  //
  // Returns the strength of the current password
  //
  public checkPasswordStrength(password: string):string {

      // Build up the strenth of our password
      let numberOfElements = 0;
      numberOfElements = /.*[a-z].*/.test(password) ? ++numberOfElements : numberOfElements;      // Lowercase letters
      numberOfElements = /.*[A-Z].*/.test(password) ? ++numberOfElements : numberOfElements;      // Uppercase letters
      numberOfElements = /.*[0-9].*/.test(password) ? ++numberOfElements : numberOfElements;      // Numbers
      numberOfElements = /[^a-zA-Z0-9]/.test(password) ? ++numberOfElements : numberOfElements;   // Special characters (inc. space)

      // Assume we have a poor password already
      let currentPasswordStrength = 'Short';

      // Check then strenth of this password using some simple rules
      if (password === null || password.length < PasswordCheckService.MinimumLength) {
          currentPasswordStrength = 'Short';
      } else if (this.isPasswordCommon(password) === true) {
          currentPasswordStrength = 'Common';
      } else if (numberOfElements === 0 || numberOfElements === 1 || numberOfElements === 2) {
          currentPasswordStrength = 'Weak';
      } else if (numberOfElements === 3) {
          currentPasswordStrength = 'Ok';
      } else {
          currentPasswordStrength = 'Strong';
      }

      // Return the strength of this password
      return currentPasswordStrength;
  }
}
