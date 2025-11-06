

export function updateState(myBinding: string): string {
  myBinding =
    myBinding.charAt(myBinding.length - 1) +
    myBinding.substring(0, myBinding.length - 1);
  console.log("state: " + myBinding);
  return myBinding
}

