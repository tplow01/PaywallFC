// Legacy URL — `/` is now the campaign home. Keep bookmarks working.
export async function getServerSideProps() {
  return { redirect: { destination: "/", permanent: true } };
}

export default function LandingRedirect() {
  return null;
}
