export function Avatar({id = '0'}: {id?: string}) {
  const gender = +id % 2 === 0 ? 'women' : 'men';
  return (
    <img
      className="block h-8 rounded-full"
      src={'https://randomuser.me/api/portraits/' + gender + '/' + id + '.jpg'} alt="Avatar"
    />
  );
}
