
class SqlError extends Error {
  /**
   * @param {Error} error original error object
   * @param {String} controllerName name of controller where error ocurred
   * @param {String} controllerMethod name of method where error occurred
   * @param {Number} status HTML Status code (if applicable)
   */
  constructor(error, controllerName, controllerMethod, status = 500) {
    super(error.message);  // bult-in param for Error object 

    // Detail has format Key (username)=(evanmcneely) already exists.
    const [field, value] = error.detail.match(/\([a-z]+\)/g);
    this.msg = {
      field: field.substring(1, field.length - 1),
      value: value.substring(1, value.length - 1),
      table: error.table,
      type: getErrorType(error.code),
    };

    this.serverLog = `ERROR: ${controllerName}.${controllerMethod}: ${error.detail}`;
    this.status = status;
  }
}

const getErrorType = (code) => {
  switch (code) {
    case '23000': {
      return 'integrity_constraint_violation';
    }
    case '23502': {
      return 'not_null_violation';
    }
    case '23503': {
      return 'foreign_key_violation';
    }
    case '23505': {
      return 'unique_violation';
    }
    case '23514': {
      return 'check_violation';
    }
    default:
      return 'Unkown SQL Error';
  }
};

module.exports = SqlError;