import '@/styles/globals.css';
import { ChakraProvider } from '@chakra-ui/react'
import Navigation from "@/components/Navigation.js"
import Footer from "@/components/Footer.js"


export default function App({Component, pageProps}) {
    return (
        <ChakraProvider>
            <Navigation/>
                <Component {...pageProps}/>
            <Footer/>
        </ChakraProvider>
    );
}