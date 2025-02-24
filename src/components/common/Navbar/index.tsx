import Image from 'next/image';
import 'primeicons/primeicons.css';

const Navbar = () => {
  return (
    <nav
      className='flex justify-between items-center px-6 h-16 bg-white text-black shadow-sm fixed top-0 left-0 w-full z-50'
      role='navigation'
    >
      <a href='/'>
        <Image src='/img/logo.svg' alt='logo' width={203} height={48} />
      </a>

      <div className='flex justify-start'>
        <a href='#' className='p-4 border-l-[1px] border-black'>
          <span className='pi pi-user' style={{ fontSize: '16px' }}></span>
          <span className='ml-2 font-bold text-sm'>Login</span>
        </a>
        <a href='#' className='p-4 border-l-[1px] border-black'>
          <span
            className='pi pi-shopping-bag'
            style={{ fontSize: '16px' }}
          ></span>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
