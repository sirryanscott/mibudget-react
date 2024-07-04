function Account({name, pendingAmount, currentBalance}) {
  return (
      <li contentEditable="true">{name} ${pendingAmount} ${currentBalance}</li>
  );
}

export default Account 
