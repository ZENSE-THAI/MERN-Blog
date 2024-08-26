import { Button } from "flowbite-react";

export const CallToAction = () => {
    const url = 'https://gomycode.com/wp-content/uploads/2023/09/Why-Is-JS-So-Popular-2048x1152.jpg';

    return (
        <div className="flex flex-col sm:flex-row justify-center items-center p-3 border border-blue-500 rounded-tl-3xl rounded-br-3xl text-center">
            <div className="flex-1 flex flex-col justify-center items-center p-7">
                <h1 className="font-semibold text-xl lg:text-2xl">Welcome&apos;s to Call to Action</h1>
                <p className="text-sm text-gray-500 my-2">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, mollitia dolorum! Provident, fuga? Aliquam illo eos asperiores animi, nobis nihil illum ipsum! Suscipit ipsam tempora nesciunt sint illum, provident facere!
                </p>
                <Button gradientDuoTone="purpleToBlue" className="w-full rounded-tl-xl rounded-bl-none ">
                    <a href="#" target="blank" rel="noopener noreferrer" >Learn More</a>
                </Button>
            </div>
            <div className="p-7 flex-1">
                <img src={url} alt="Call to Action" className="max-w-full h-auto" />
            </div>
        </div>
    );
};
