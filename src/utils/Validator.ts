export default class Validator {
  public static email: RegExp = /^[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/;
  public static username: RegExp = /^[\w]{5,16}$/;
  public static password: RegExp = /^[0-9A-Za-z]{6,15}$/;

}