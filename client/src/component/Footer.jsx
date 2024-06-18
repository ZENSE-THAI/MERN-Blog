
"use client";

import { Footer } from "flowbite-react";
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";
import { Link } from "react-router-dom";

export function FooterComponent() {
  return (
    <Footer container className="border-t-4 border-sky-500 ">
     <div className="w-full">
      <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
        <div className="">
        <Link to='/' className='uppercase self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
          <span className=' px-2 py-1 bg-gradient-to-tr from-sky-500 to-indigo-500 rounded-lg text-white'>Zense</span>
          Blogs
        </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4 sm:grid-cols-3 sm:gap-6">
          <div className="">
          <Footer.Title title="RESOURCES"/>
          <Footer.LinkGroup col>
              <Footer.Link
               href="https://flowbite.com"
               name="Flowbite"
               target="_blank">
                Flowbite
              </Footer.Link>
              <Footer.Link
               href="https://tailwindcss.com/"
               name="Tailwind css"
               target="_blank">
                Tailwind CSS
              </Footer.Link>
          </Footer.LinkGroup>
          </div>
          <div className="">
          <Footer.Title title="FOLLOW US"/>
          <Footer.LinkGroup col>
              <Footer.Link
               href="https://github.com/ZENSE-THAI"
               name="Github"
               target="_blank">
                Github
              </Footer.Link>
              <Footer.Link
               href="https://www.instagram.com/_iswinter"
               name="Tailwind css"
               target="_blank">
                Instagram
              </Footer.Link>
              <Footer.Link
               href="https://discord.gg/pDUPqWPDPR"
               name="Discord"
               target="_blank">
                Discord
              </Footer.Link>
          </Footer.LinkGroup>
          </div>
          <div className="">
          <Footer.Title title="LEGAL"/>
          <Footer.LinkGroup col>
              <Footer.Link
               href="#"
               name="License"
               target="_blank">
                License
              </Footer.Link>
              <Footer.Link
               href="#"
               name="Terms Conditions"
               target="_blank">
                Terms &amp; Conditions
              </Footer.Link>
          </Footer.LinkGroup>
          </div>
        </div>
      </div>
      <Footer.Divider />
      <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright href="#" by="ZENSE™" year={2024} />
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsGithub} />
            <Footer.Icon href="#" icon={BsDribbble} />
          </div>
        </div>
     </div>
    </Footer>
  );
}
