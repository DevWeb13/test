import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

export default component$(() => {
  return (
    <>
      <h1>Hi account</h1>
      <Link href='/'>Home</Link>
    </>
  );
});
