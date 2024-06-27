import { useSelector } from 'react-redux';
import { TextInput ,Button } from 'flowbite-react'


export const DashProfile = () => {
    const currentUser = useSelector(state=>state.user.currentUser);
    console.log(currentUser.password);

  return (
    <div className='max-w-lg mx-auto p-4 w-full'>
    <h1 className='my-7 text-center text-3xl font-semibold'>Profile Edit</h1>
    <form className='flex flex-col gap-4'>
        <div className="h-32 w-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
            <img src={currentUser.profilePicture} alt="User Profile Picture"  className='rounded-full w-full h-full object-cover border-4 border-[lightgray]'/>
        </div>
        <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username}  autoComplete="current-password"/>
        <TextInput type='text' id='email' placeholder='email' defaultValue={currentUser.email}  autoComplete="current-password"/>
        <TextInput type='password' id='password' placeholder='password'autoComplete="current-password"/>
        <Button type='submit' color='blue' className='font-bold'>Update</Button>
    </form>
    <div className="text-red-500 mt-5 flex justify-end">
        <span className=''>
            Delete Account
        </span>
    </div>
    </div>
  )
}
