import React, {useState, useEffect} from "react";
import {
    Box,
    Button,
    Container,
    Input,
    Stack,
    Heading,
    Text,
    Link,
    Center,
    Image,
    Alert,
    AlertIcon,
    AlertTitle,
} from "@chakra-ui/react";
import supabase from "@/utils/supabaseClient";
import Head from "next/head";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleLogin = async () => {
        const {data, error} = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.log(error);
            setError(error);
        } else {
            window.location.href = "/";
        }
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Enter") {
                handleLogin();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [email, password]);

    return (
        <>
            <Head>
                <title>Bejelentkezés | ETHH</title>
                <link rel="icon" href="/images/ETHH.png"/>
                <meta name="description" content="Jelentkezz be ETHH fiókodba"/>
            </Head>
            <Container maxW="xl" py={12} className="page-container">
                <Box
                    p={8}
                    bg="gray.50"
                    _dark={{bg: "linear-gradient(135deg, black, red)"}}
                    shadow="lg"
                    rounded="lg"
                    border="1px"
                    borderColor="gray.200"
                    className="login-container"
                >
                    <Center>
                        <Image
                            src="/images/ETHH.png"
                            alt="ETHH logo"
                            height="150px"
                            width="150px"
                            className="login-logo"
                        />
                    </Center>
                    <Box className="login-content">
                        <Stack spacing={6}>
                            <Heading
                                mb={5}
                                fontSize="2xl"
                                textAlign="center"
                                color="black"
                            >
                                Jelentkezz be ETHH fiókodba
                            </Heading>

                            {error && (
                                <Alert status="error">
                                    <AlertIcon/>
                                    <AlertTitle>{error.message}</AlertTitle>
                                </Alert>
                            )}

                            <Stack spacing={4}>
                                <Text mt={3} color="black">
                                    Add meg az emailcímed
                                </Text>
                                <Input
                                    color="black"
                                    placeholder="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    bg="gray.100"
                                    borderColor="gray.300"
                                    _dark={{
                                        bg: "gray.900",
                                        borderColor: "gray.600",
                                        color: "gray.400",
                                    }}
                                    _placeholder={{color: "gray.500"}}
                                />
                                <Text mt={3} color="black">
                                    Add meg a jelszavad
                                </Text>
                                <Input
                                    color="black"
                                    placeholder="Jelszó"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    bg="gray.100"
                                    borderColor="gray.300"
                                    _dark={{
                                        bg: "gray.900",
                                        borderColor: "gray.600",
                                        color: "gray.400",
                                    }}
                                    _placeholder={{color: "gray.500"}}
                                />
                                <Button
                                    width="100%"
                                    mt={3}
                                    colorScheme="blackAlpha"
                                    onClick={handleLogin}
                                    isDisabled={!email || !password}
                                    fontWeight={400}
                                    fontSize="lg"
                                >
                                    Bejelentkezés
                                </Button>
                                <Center>
                                    <Text mt={3} color="black">
                                        Még nincs fiókod?{" "}
                                        <Link href="/signup" color="black">Regisztrálj!</Link>
                                    </Text>
                                </Center>
                            </Stack>
                        </Stack>
                    </Box>
                </Box>
                <footer className="footer">
                    <Text color="white">Footer Content</Text>
                </footer>
            </Container>
        </>
    );
};

export default LoginPage;