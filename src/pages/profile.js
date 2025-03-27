import React, {useState, useEffect} from "react";
import {
    Box,
    Button,
    Container,
    Input,
    Stack,
    Heading,
    Text,
    Avatar,
    Center,
    Alert,
    AlertIcon,
    AlertTitle,
} from "@chakra-ui/react";
import supabase from "@/utils/supabaseClient";
import Head from "next/head";

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [profilePic, setProfilePic] = useState(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const {data: {user}} = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                setEmail(user.email);
                const {data, error} = await supabase
                    .from('profiles')
                    .select('username, avatar_url')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setUsername(data.username);
                    setProfilePic(data.avatar_url);
                }
            }
            else {
                window.location.href = "/";
            }
        };

        fetchUser();
    }, []);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const fileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const filePath = `${fileName}`;

        const {data: existingFile, error: checkError} = await supabase
            .storage
            .from('pfps')
            .list('', {search: fileName});

        if (checkError) {
            console.error("Error checking file existence:", checkError.message);
            return;
        }

        let publicUrl;

        if (existingFile.length > 0) {
            const {data: {publicUrl: existingFileUrl}, error: urlError} = supabase
                .storage
                .from('pfps')
                .getPublicUrl(filePath);

            if (urlError) {
                console.error("Error getting existing file URL:", urlError.message);
                return;
            }

            publicUrl = existingFileUrl;
        } else {
            const {data: uploadData, error: uploadError} = await supabase.storage
                .from('pfps')
                .upload(filePath, file);

            if (uploadError) {
                console.error("Error uploading file:", uploadError.message);
                return;
            }

            const {data: {publicUrl: newFileUrl}, error: urlError} = supabase
                .storage
                .from('pfps')
                .getPublicUrl(filePath);

            if (urlError) {
                console.error("Error getting new file URL:", urlError.message);
                return;
            }

            publicUrl = newFileUrl;
        }

        const {error: updateError} = await supabase
            .from('profiles')
            .update({avatar_url: publicUrl})
            .eq('id', user.id);

        if (updateError) {
            console.error("Error updating profile:", updateError.message);
            return;
        }

        setProfilePic(publicUrl);
    };

    const handleUpdateProfile = async () => {
        if (!username) {
            setError("Username cannot be empty");
            return;
        }

        // Get the current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
            setError("Error getting session");
            return;
        }

        const accessToken = sessionData.session.access_token;

        // Check if the new username already exists only if the username has changed
        if (username !== user.username) {
            try {
                const response = await fetch(`https://hizgcpgzmireapqliudy.supabase.co/rest/v1/profiles?select=id&username=eq.${username}`, {
                    headers: {
                        'apikey': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpemdjcGd6bWlyZWFwcWxpdWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MTg5MjAsImV4cCI6MjA1MTk5NDkyMH0.e7UwYnLSBbsOA5kWW8GAQgORwisj4xbykJ0FmpfiCf0",
                        'Authorization': `Bearer ${accessToken}`,
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error checking username: ${response.statusText}`);
                }

                const existingUser = await response.json();

                if (existingUser.length > 0) {
                    setError("Username already exists");
                    return;
                }
            } catch (error) {
                console.error("Error checking username:", error.message);
                setError("Error checking username");
                return;
            }
        }

        const updates = { username };
        if (profilePic) {
            updates.avatar_url = profilePic;
        }

        const { error: updateError } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id);

        if (updateError) {
            setError("Error updating profile");
            return;
        }

        if (password) {
            const { error: passwordError } = await supabase.auth.updateUser({
                password,
            });

            if (passwordError) {
                setError("Error updating password");
                return;
            }
        }

        // Update comments with new profile name and picture
        const { error: updateCommentsError } = await supabase
            .from('feeds')
            .update({ username, avatar_url: profilePic })
            .eq('id', user.id);

        if (updateCommentsError) {
            console.error("Error updating comments:", updateCommentsError.message);
            setError("Error updating comments");
            return;
        } else {
            console.log("Comments updated successfully");
        }

        setSuccess("Profile updated successfully!");
    };

    const handleDeleteProfile = async () => {
        const {error: deleteError} = await supabase
            .from('profiles')
            .delete()
            .eq('id', user.id);

        if (deleteError) {
            setError("Error deleting profile");
            return;
        }

        const {error: authError} = await supabase.auth.signOut();

        if (authError) {
            setError("Error signing out");
            return;
        }

        setSuccess("Profile deleted successfully!");
        window.location.href = "/"; // Redirect to home page after successful deletion
    };

    return (
        <>
            {user && (
                <>
                    <Head>
                        <title>Profile | ETHH</title>
                        <link rel="icon" href="/images/ETHH.png"/>
                        <meta name="description" content="View and edit your profile"/>
                    </Head>
                    <Container maxW="md" py={12}>
                        <Box
                            p={8}
                            bg="white"
                            _dark={{bg: "gray.900", borderColor: "gray.600"}}
                            boxShadow="2xl"
                            rounded="lg"
                        >
                            <Stack spacing={4}>
                                <Center>
                                    <Avatar
                                        size="xl"
                                        src={profilePic || '/images/default-avatar.jpg'}
                                        cursor='pointer'
                                        onClick={() => document.getElementById('fileInput').click()}
                                    />
                                    <Input type="file" id="fileInput" style={{display: 'none'}} onChange={handleFileChange}/>
                                </Center>
                                <Center>
                                    <Heading as="h3" size="md" mt={2}>
                                        {username}
                                    </Heading>
                                </Center>
                                <Heading fontSize="2xl" textAlign="center" mb={5}>
                                    Profile
                                </Heading>
                                {error && (
                                    <Alert status="error">
                                        <AlertIcon/>
                                        <AlertTitle>{error}</AlertTitle>
                                    </Alert>
                                )}
                                {success && (
                                    <Alert status="success">
                                        <AlertIcon/>
                                        <AlertTitle>{success}</AlertTitle>
                                    </Alert>
                                )}
                                <Stack spacing={2}>
                                    <Box>
                                        <Text>Username</Text>
                                        <Input
                                            name="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </Box>
                                    <Box>
                                        <Text>Email</Text>
                                        <Input
                                            name="email"
                                            type="email"
                                            value={email}
                                            isReadOnly
                                        />
                                    </Box>
                                    <Box>
                                        <Text>Password</Text>
                                        <Input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </Box>
                                </Stack>
                                <Center>
                                    <Button
                                        mt={5}
                                        colorScheme="blue"
                                        onClick={handleUpdateProfile}
                                        fontWeight={400}
                                        fontSize="lg"
                                    >
                                        Update Profile
                                    </Button>
                                </Center>
                                <Center>
                                    <Button
                                        mt={-2}
                                        colorScheme="red"
                                        onClick={handleDeleteProfile}
                                        fontWeight={400}
                                        fontSize="lg"
                                    >
                                        Delete Profile
                                    </Button>
                                </Center>
                            </Stack>
                        </Box>
                    </Container>
                </>
            )}
        </>
    );
}