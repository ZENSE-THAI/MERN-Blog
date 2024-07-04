import { TextInput, Textarea, FileInput, Label, Checkbox ,Button} from "flowbite-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export const CreatePost = () => {

    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <h1 className="font-semibold text-2xl md:text-4xl text-center my-7">CreatePost</h1>
            <form className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-row justify-between items-center">
                    <TextInput type="text" placeholder='Title' className="w-full flex-1" required autoComplete="true" color='gray' />
                    <div className="flex flex-wrap">
                        <div className="flex items-center gap-2">
                            <Checkbox id="accept-react" value='react' defaultChecked />
                            <Label htmlFor="accept-react" className="flex">
                                React
                            </Label>
                            <Checkbox id="accept-javascript" value='javascript' />
                            <Label htmlFor="accept-javascript" className="flex">
                                JavaScript
                            </Label>
                            <Checkbox id="accept-nodejs" value='nodejs' />
                            <Label htmlFor="accept-nodejs" className="flex">
                                Nodejs
                            </Label>
                            <Checkbox id="accept-htmlcss" value='html&css' />
                            <Label htmlFor="accept-htmlcss" className="flex">
                                Html&Css
                            </Label>
                            <Checkbox id="accept-flowbite" value='flowbite' />
                            <Label htmlFor="accept-flowbite" className="flex">
                                Flowbite
                            </Label>
                        </div>
                    </div>
                </div>
                <Textarea className="flex-1" type="text" placeholder='Description' required autoComplete="true" />
                <label htmlFor="dropzone-file">Front Cover Picture</label>
                <div className="flex w-full items-center justify-center">
                    <Label
                        htmlFor="dropzone-file"
                        className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                        <div className="flex flex-col items-center justify-center pb-6 pt-5">
                            <svg
                                className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 16"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <FileInput id="dropzone-file" className="hidden" />
                    </Label>
                </div>
                <ReactQuill
                    theme="snow"
                    placeholder="Write something...."
                    className="h-72 mb-12 text-gray-900 dark:text-gray-100"
                    required
                />
                <Button color='blue'>Publisher</Button>
            </form>
        </div>
    );
}

export default CreatePost;
