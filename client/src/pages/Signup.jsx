import React from 'react'
import {  Link } from 'react-router-dom'
import { FloatingLabel,Label,Button} from 'flowbite-react'


export const Signup = () => {
  return (
   <div className="min-h-screen mt-20">
    <div className="flex gap-5 p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center  ">
      {/* left */}
      <div className="flex-1 text-center md:text-start">
        <Link to='/' className='uppercase  font-bold dark:text-white text-4xl'>
        <span className=' px-2 py-1 bg-gradient-to-tr from-sky-500 to-indigo-500 rounded-lg text-white'>Zense</span>
        Blogs
        </Link>
        <p className='text-sm mt-5'>
          This is MyBlog Project, You can Sign up with you email and password
          or with Google.
        </p>
      </div>
      {/* right */}
      <div className="flex-1 mt-5 ">
        <form action=""  className="flex flex-col gap-2">
          <div>
            <Label value='Your FullName'/>
            <FloatingLabel variant="outlined" label="FullName" id='fullname' disabled={false} />
          </div>
          <div>
            <Label value='Your E-mail'/>
            <FloatingLabel variant="outlined" label="E-mail" id='email' disabled={false} />
          </div>
          <div>
            <Label value='Your Password'/>
            <FloatingLabel variant="outlined" type='password' label="Password" id='password' disabled={false} />
          </div>
          <Button gradientDuoTone="purpleToBlue" className='w-full' type='submit'>Sign Up</Button>
        </form>
        <div className="">
          <span>Have an account?</span>
          <Link to='/sign-in'className='text-blue-500 ml-2 '>
          Sign In
          </Link>
        </div>
      </div>
    </div>
   </div>
  )
}
