const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 w-full flex justify-center items-center h-12 bg-gray-800 text-white">
      &copy;{currentYear} Made by{" "}
      <span className="underline">
        <a href="https://www.saransh-bangar.xyz/" target="_blank">
          Saransh Bangar
        </a>
      </span>
    </footer>
  );
};

export default Footer;
