import { Button } from '@/components/ui/Button'
import CubeIcon from '@/images/logo_bean_journal.png'
import texture from '@/images/prefooter-bg-dark.15254ddf.svg'

export default function CallToAction() {
    return (
        <section className="bg-black text-white py-10">
            <div className="mx-auto max-w-8xl grid md:grid-cols-2 items-center gap-4 px-6">
                <div className="text-center md:text-left pl-0 md:pl-[20vw] mx-auto">
                    <h2 className="font-publica-sans text-6xl font-semibold md:text-7xl lg:text-8xl">
                        Try Bean Journal Now
                    </h2>

                    <div className="mt-6 flex justify-center md:justify-start">
                        <Button
                            asChild
                            size="lg"
                            className="w-full sm:w-auto bg-white text-black hover:bg-gray-200 border border-white px-2 pr-4 py-4"
                        >
                            <a href="/" className="flex items-center justify-center">
                                <img src={CubeIcon} alt="Cube Icon" className="h-8 w-8" />
                                <span className="text-xl font-mono font-normal">Download for Free</span>
                            </a>
                        </Button>
                    </div>
                </div>

                <div className="hidden md:block relative isolate overflow-hidden">
                    <img src={CubeIcon} alt="Cube Icon" className="w-[35rem] max-w-full h-auto" />
                    <img src={texture} alt="Texture" className="absolute inset-0 ml-[7rem] -mt-[10rem] w-[80rem] h-[80rem] z-[-1]" />
                </div>
            </div>
        </section>
    )
}
