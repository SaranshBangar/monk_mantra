const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex justify-center items-center h-12 bg-gray-800 text-white mt-auto">
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
