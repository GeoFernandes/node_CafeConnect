export function isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validaCampos<T>(obj: Partial<T>): boolean {
    const emptyFields = Object.keys(obj).filter((key) => !obj[key as keyof T]);
  
   return (emptyFields.length === 0) ?  true :  false;
  }
  
  