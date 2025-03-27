import {useRouter} from 'next/router';
import {
    Box,
    Flex,
    Heading,
    HStack,
    Button,
    AvatarGroup,
    Avatar,
    IconButton,
    Container,
    Image,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    VStack,
    Input,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from '@chakra-ui/react';
import {HamburgerIcon} from '@chakra-ui/icons';
import Link from 'next/link';
import React, {useState, useEffect} from 'react';
import supabase from '@/utils/supabaseClient';

const Navigation = ({toggleMenu}) => {
    const [user, setUser] = useState(null);
    const [profilePic, setProfilePic] = useState(null);
    const [username, setUsername] = useState(null);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const {data: {user}} = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                const {data, error} = await supabase
                    .from('profiles')
                    .select('avatar_url, username')
                    .eq('id', user.id)
                    .single();

                if (data) {
                    setProfilePic(data.avatar_url);
                    setUsername(data.username);
                }
            }
        };

        fetchUser();
    }, [router.asPath]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfilePic(null);
        setUsername(null);
        window.location.reload(); // Refresh the page after logout
    };

    const isAuthPage = router.pathname === '/login' || router.pathname === '/signup';
    const isProfilePage = router.pathname === '/profile';

    return (
        <Container maxW={"5XL"}>
            <Box w="100%" mb={8} mt={2}>
                <Flex align="center" justify="space-between">
                    <Link href={"/"} passHref>
                        <HStack spacing={2}>
                            <Box width="50px" height="50px">
                                <Image id="logo" src="/images/ETHH.png" alt="ETHH" width="100%" height="110%"
                                       objectFit="contain"/>
                            </Box>
                            <Heading as="h1" size="lg">
                                ETHH
                            </Heading>
                        </HStack>
                    </Link>

                    <HStack spacing={10} display={{base: 'none', md: 'flex'}}>
                        {isAuthPage || isProfilePage ? (
                            <Link href="/" passHref>
                                <Button className="menupont menupont_4" variant="link" size="lg">
                                    Home
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="#tortenet" passHref>
                                    <Button className="menupont menupont_2" variant="link" size="lg">
                                        Történet
                                    </Button>
                                </Link>
                                <Link href="#menet" passHref>
                                    <Button className="menupont menupont_1" variant="link" size="lg">
                                        A játékról
                                    </Button>
                                </Link>
                                <Link href="#board" passHref>
                                    <Button className="menupont menupont_3" variant="link" size="lg">
                                        Leaderboard
                                    </Button>
                                </Link>
                            </>
                        )}

                        {user ? (
                            !isProfilePage && (
                                <HStack spacing={4} align="center">
                                    <Menu>

                                        <MenuButton as={Flex} alignItems="center" cursor="pointer">
                                            <HStack>
                                                <AvatarGroup>
                                                    <Avatar src={profilePic || '/images/default-avatar.jpg'}/>
                                                </AvatarGroup>
                                                <Heading size="md" mr={4}>
                                                    {username}
                                                </Heading>
                                            </HStack>
                                        </MenuButton>
                                        <MenuList>
                                            <MenuItem onClick={() => router.push('/profile')}>Edit Profile</MenuItem>
                                            <MenuItem onClick={handleLogout}>Kijelentkezés</MenuItem>
                                        </MenuList>
                                    </Menu>
                                    <Button as="a" href="#game" passHref
                                            className="download-button">Download</Button>
                                </HStack>
                            )
                        ) : (
                            !isAuthPage && (
                                <HStack spacing={4}>
                                    <Link href="/login" passHref>
                                        <Button className="login-button" variant="link" size="lg">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link href="/signup" passHref>
                                        <Button id="gomb" variant="solid" size="lg">
                                            Register
                                        </Button>
                                    </Link>
                                </HStack>
                            )
                        )}
                    </HStack>

                    <IconButton
                        icon={<HamburgerIcon/>}
                        aria-label="Open menu"
                        display={{base: 'block', md: 'none'}}
                        onClick={onOpen}
                    />
                </Flex>
            </Box>

            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                <DrawerOverlay/>
                <DrawerContent>
                    <DrawerCloseButton/>
                    <DrawerHeader>Menu</DrawerHeader>
                    <DrawerBody>
                        <VStack spacing={4}>
                            {isAuthPage || isProfilePage ? (
                                <Link href="/" passHref>
                                    <Button className="menupont menupont_1" variant="link" size="lg" onClick={onClose}>
                                        Home
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href="#menet" passHref>
                                        <Button className="menupont menupont_1" variant="link" size="lg"
                                                onClick={onClose}>
                                            A játékról
                                        </Button>
                                    </Link>
                                    <Link href="#tortenet" passHref>
                                        <Button className="menupont menupont_2" variant="link" size="lg"
                                                onClick={onClose}>
                                            Történet
                                        </Button>
                                    </Link>
                                    <Link href="#board" passHref>
                                        <Button className="menupont menupont_3" variant="link" size="lg"
                                                onClick={onClose}>
                                            Leaderboard
                                        </Button>
                                    </Link>
                                </>
                            )}

                            {user ? (
                                !isProfilePage && (
                                    <VStack spacing={4} align="center">
                                        <Menu>
                                            <MenuButton as={Flex} alignItems="center" cursor="pointer">
                                                <AvatarGroup>
                                                    <Avatar src={profilePic || '/images/default-avatar.jpg'}/>
                                                </AvatarGroup>
                                                <Heading size="md" ml={2}>
                                                    {username}
                                                </Heading>
                                            </MenuButton>
                                            <MenuList>
                                                <MenuItem onClick={() => router.push('/profile')}>Edit
                                                    Profile</MenuItem>
                                                <MenuItem onClick={handleLogout}>Kijelentkezés</MenuItem>
                                            </MenuList>
                                        </Menu>
                                        <Button as="a" href="#game" passHref
                                                className="download-button">Download</Button>
                                    </VStack>
                                )
                            ) : (
                                !isAuthPage && (
                                    <VStack spacing={4}>
                                        <Link href="/login" passHref>
                                            <Button className="login-button" variant="link" size="lg" onClick={onClose}>
                                                Login
                                            </Button>
                                        </Link>
                                        <Link href="/signup" passHref>
                                            <Button id="gomb" variant="solid" size="lg" onClick={onClose}>
                                                Register
                                            </Button>
                                        </Link>
                                    </VStack>
                                )
                            )}
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Container>
    );
};

export default Navigation;