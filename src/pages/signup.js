import React, { useState } from "react";
import {
    Box,
    Button,
    Container,
    Input,
    Stack,
    Heading,
    Text,
    Image,
    Center,
    Link,
    Checkbox,
    Alert,
    AlertIcon,
    AlertTitle,
} from "@chakra-ui/react";
import supabase from "@/utils/supabaseClient";
import Head from "next/head";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleRegister = async () => {
        if (!isValidEmail(email)) {
            setError("Invalid email format");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (signUpError) {
            setError(signUpError.message);
            return;
        }

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !sessionData?.session?.user?.id) {
            setError("Session error");
            return;
        }

        const userUuid = sessionData.session.user.id;

        const { error: profileError } = await supabase
            .from("profiles")
            .insert([{
                id: userUuid,
                username
            }]);

        if (profileError) {
            setError("Error inserting profile");
            return;
        }

        setSuccess("Registration completed successfully!");
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    return (
        <>
            <Head>
                <title>Regisztráció | ETHH</title>
                <link rel="icon" href="/images/ETHH.png" />
                <meta name="description" content="Regisztrálj ETHH fiókot!" />
            </Head>
            <Container maxW="xl" py={12}>
                <Box
                    p={8}
                    bg="gray.50"
                    _dark={{ bg: "linear-gradient(135deg, black, red)" }}
                    shadow="lg"
                    rounded="lg"
                    border="1px"
                    borderColor="gray.200"
                >
                    <Stack spacing={6}>
                        <Center>
                            <Image src="/images/ETHH.png" alt="ETHH" height="150px" width="150px" />
                        </Center>
                        <Heading fontSize="2xl" textAlign="center" mb={5} color="black">
                            Regisztrálj és játssz!
                        </Heading>
                        {error && (
                            <Alert status="error">
                                <AlertIcon />
                                <AlertTitle>{error}</AlertTitle>
                            </Alert>
                        )}
                        {success && (
                            <Alert status="success">
                                <AlertIcon />
                                <AlertTitle>Sikeres regisztráció! Most jelentkezz be.</AlertTitle>
                            </Alert>
                        )}
                        <Stack spacing={2}>
                            <Stack spacing={4}>
                                <Box>
                                    <Text color="black">Felhasználónév</Text>
                                    <Input
                                        name="name"
                                        value={username}
                                        placeholder="Jane Doe"
                                        onChange={(e) => setUsername(e.target.value)}
                                        color="black"
                                        bg="gray.100"
                                        borderColor="gray.300"
                                        _dark={{
                                            bg: "gray.900",
                                            borderColor: "gray.600",
                                            color: "gray.400",
                                        }}
                                        _placeholder={{ color: "gray.500" }}
                                    />
                                </Box>
                                <Box>
                                    <Text color="black">Email</Text>
                                    <Input
                                        name="email"
                                        type="email"
                                        value={email}
                                        placeholder="pelda@email.domain"
                                        onChange={(e) => setEmail(e.target.value)}
                                        color="black"
                                        bg="gray.100"
                                        borderColor="gray.300"
                                        _dark={{
                                            bg: "gray.900",
                                            borderColor: "gray.600",
                                            color: "gray.400",
                                        }}
                                        _placeholder={{ color: "gray.500" }}
                                    />
                                </Box>
                                <Box>
                                    <Text color="black">Jelszó</Text>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        color="black"
                                        bg="gray.100"
                                        borderColor="gray.300"
                                        _dark={{
                                            bg: "gray.900",
                                            borderColor: "gray.600",
                                            color: "gray.400",
                                        }}
                                        _placeholder={{ color: "gray.500" }}
                                    />
                                </Box>
                                <Box>
                                    <Text color="black">Jelszó megerősítése</Text>
                                    <Input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        color="black"
                                        bg="gray.100"
                                        borderColor="gray.300"
                                        _dark={{
                                            bg: "gray.900",
                                            borderColor: "gray.600",
                                            color: "gray.400",
                                        }}
                                        _placeholder={{ color: "gray.500" }}
                                    />
                                </Box>
                            </Stack>
                        </Stack>
                        <Checkbox
                            mt={2}
                            isChecked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                            color="black"
                        >
                            Elfogadom a felhasználási feltételeket és az adatvédelmi nyilatkozatot
                        </Checkbox>
                    </Stack>

                    <Center>
                        <Button
                            mt={5}
                            colorScheme="blackAlpha"
                            onClick={handleRegister}
                            isDisabled={!acceptedTerms}
                            fontWeight={400}
                            fontSize="lg"
                        >
                            Regisztráció
                        </Button>
                    </Center>
                    <Center>
                        <Text mt={3} color="black">
                            Már van fiókod? <Link href="/login" color="black">Jelenetkezz be!</Link>
                        </Text>
                    </Center>
                </Box>
            </Container>
        </>
    );
}
