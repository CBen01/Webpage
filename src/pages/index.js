import React, {useState, useEffect} from "react";
import {
    Box,
    Button,
    Container,
    Heading,
    VStack,
    HStack,
    Avatar,
    Text,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Image,
    Center,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    SimpleGrid,
    Link,
    Flex,
} from "@chakra-ui/react";
import Head from "next/head";
import {Carousel} from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import supabase from "@/utils/supabaseClient";
import {v4 as uuidv4} from "uuid";

export default function LandingPage() {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showArrows, setShowArrows] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]);
    const [feedback, setFeedback] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedHeading, setSelectedHeading] = useState("");
    const [selectedText, setSelectedText] = useState("");
    const [rating, setRating] = useState(0);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [editingFeedbackId, setEditingFeedbackId] = useState(null);
    const [editingFeedback, setEditingFeedback] = useState("");
    const [editingRating, setEditingRating] = useState(0);
    const [feedbackToDelete, setFeedbackToDelete] = useState(null);
    const {
        isOpen: isDeleteModalOpen,
        onOpen: onDeleteModalOpen,
        onClose: onDeleteModalClose
    } = useDisclosure();

    const fetchFeedbacks = async () => {
        const { data, error } = await supabase
            .from("feeds")
            .select("id, user_id, username, avatar_url, feedback, rating");

        if (error) {
            console.error("Error fetching feedbacks:", error.message);
            return;
        }

        setFeedbacks(data || []);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const {data, error} = await supabase
                    .from("times")
                    .select("username, times")
                    .order("times", {ascending: true});

                if (error) {
                    throw error;
                }

                setUsers(data || []);
            } catch (err) {
                console.error("Error fetching users:", err.message);
                setError("Nem sikerült lekérni a felhasználókat. Van neted?");
            } finally {
                setLoading(false);
            }
        };

        const fetchUser = async () => {
            const {data: {user}} = await supabase.auth.getUser();
            if (user) {
                const {data: profile, error} = await supabase
                    .from("profiles")
                    .select("username, avatar_url")
                    .eq("id", user.id)
                    .single();

                if (error) {
                    console.error("Error fetching user profile:", error.message);
                    return;
                }

                setUser({...user, username: profile.username, avatar_url: profile.avatar_url});
            }
        };

        fetchUser();
        fetchUsers();
        fetchFeedbacks();
    }, []);

    const handleFeedbackSubmit = async () => {
        if (!feedback || rating === 0) return;

        if (!user) {
            alert("You must be logged in to submit feedback.");
            return;
        }

        if (user.id === "072d27a4-70c9-4de8-a457-4dd9c70f107a" && (rating === 1 || rating === 2 || rating === 3)) {
            alert("Szopd le a faszom!");
            return;
        }

        const { error } = await supabase
            .from("feeds")
            .insert([{
                user_id: user.id,
                id: uuidv4(),
                username: user.username,
                avatar_url: user.avatar_url,
                feedback,
                rating
            }]);

        if (error) {
            console.error("Error submitting feedback:", error.message);
            return;
        }

        setFeedback("");
        setRating(0);
        fetchFeedbacks();
    };

    const handleDeleteFeedback = async (feedbackId) => {
        const { error } = await supabase
            .from("feeds")
            .delete()
            .eq("id", feedbackId);

        if (error) {
            console.error("Error deleting feedback:", error.message);
            return;
        }

        fetchFeedbacks();
        onDeleteModalClose(); 
    };

    const confirmDeleteFeedback = (feedback) => {
        setFeedbackToDelete(feedback);
        onDeleteModalOpen();
    };

    const handleCardClick = (imageSrc, heading, text) => {
        setSelectedImage(imageSrc);
        setSelectedHeading(heading);
        setSelectedText(text);
        onOpen();
    };

    const calculateAverageRating = () => {
        if (feedbacks.length === 0) return 0;
        const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
        return (totalRating / feedbacks.length).toFixed(1);
    };

    return (
        <>
            <Head>
                <title>Escape The Horror House</title>
                <link rel="icon" href="/images/ETHH.png"/>
                <meta name="description" content="Főoldal"/>
            </Head>
            <Box width="100%" position="relative" py={8} mb={10} display="flex" alignItems="center"
                 justifyContent="center" height="60vh" className="headll">
                <Box zIndex={1} textAlign="center" className="blurry-background fade-in" display="flex"
                     flexDirection="column" alignItems="center" justifyContent="center">
                    <Heading id="cim" mb={4} className="headline fade-in">
                        Üdvözöljük a ETHH oldalán!
                    </Heading>
                    <Text id="head_sz" className="fade-in">
                        Ez a ETHH Fő oldala, itt megtekintheti a játékosok feltöltött idejét és megismerkedhet a játék
                        menetével és történetével is!
                    </Text>
                </Box>
            </Box>

            <Box mb={100}>
                <Heading className="jef" mb={6} textAlign="center" id="jatek">Az Escape from The Horror House játék</Heading>
            </Box>
            <Container maxW="container.lg" py={8} display="flex" flexDirection="column" alignItems="center">
                <Box mb={150} width="100%" onMouseEnter={() => setShowArrows(true)}
                     onMouseLeave={() => setShowArrows(false)}>
                    <Carousel showArrows={showArrows} showThumbs={true} showStatus={false} showIndicators={false}
                              autoPlay infiniteLoop className="custom-carousel fade-in">
                        <div>
                            <img src="/images/menu.jpg" alt="Image 1" className="carouselImage"/>
                        </div>
                        <div>
                            <img src="/images/ajtoKESZ.png" alt="Image 2" className="carouselImage"/>
                        </div>
                        <div>
                            <img src="/images/szelemKESZ.png" alt="Image 3" className="carouselImage"/>
                        </div>
                    </Carousel>
                </Box>

                <Heading className="jef" mb={"100px"} textAlign="center" id="tortenet">Mi a játék sztorija?</Heading>
                <Flex direction={{ base: "column", md: "row" }} alignItems="center" justifyContent="space-between" width="100%" mb={6}>
                    <Box flex="1" mb={{ base: 4, md: 0 }}>
                        <Heading size="lg" mb={-6} ml={{ base: 0, md: 40 }}>Történet</Heading>
                        <Text id="test" flex="1" mr={{ base: 0, md: 4 }} mt={10}>
                            Egy nap haza felé menet észrve vettél egy sötét figurát a szemed sarkából, de mire
                            felfigyeltél rá már késő
                            volt mivel egy határozott ütéstől el is ájultál. Ezek után egy sötét szobában ébredtél fel
                            ahol csak egy
                            lámpa pislákolt fölötted és a fény szélén csak egy zseblámpa volt. Nem tudod hogy mi ez a
                            hely,
                            vagy hogy ki és miért hozott ide, de tudod hogy egy feladatod van összesen: SZABADULJ KI
                        </Text>
                    </Box>
                    <Image src="/images/story.svg" alt="Story Image" boxSize={{ base: "200px", md: "300px" }} alignSelf="center" mb={{ base: 4, md: 0 }}/>
                </Flex>

                <Heading className="jef" mb={"100px"} textAlign="center" id="menet">Játékmenet</Heading>
                <Flex direction={{ base: "column", md: "row" }} alignItems="center" justifyContent="space-between" width="100%" mb={6}>
                    <Image src="/images/tutorial.svg" alt="Story Image" boxSize={{ base: "200px", md: "300px" }} alignSelf="center" mb={{ base: 4, md: 0 }}/>
                    <Box flex="1" ml={{ base: 0, md: 200 }}>
                        <Heading size="lg" mb={-6} ml={{ base: 0, md: "220px" }}>Menet</Heading>
                        <Text id="test2" flex="1" ml={{ base: 0, md: 4 }} mt={10}>
                            Az játékmenet arról szól, hogy minél hamarabb végig játszd a játékot, mivel van egy timer
                            ami méri
                            az idődet. Miután kivitted a játékod esélyed van megadni egy Felhasználó nevet és feltölteni
                            az
                            időt, hogy a többi felhasználó is láthassa a teljesítményedet.
                        </Text>
                    </Box>
                </Flex>

                <Box textAlign="center" py={10} id="download-section" mb="200px" id="game">
                    <Image src="/images/ETHH.png" alt="Game Logo" boxSize="150px" mx="auto" mb={4} mt="150px"/>
                    <Heading as="h2" size="lg" mb={2}>Download Our Game!</Heading>
                    <Text mb={6} width={500}>Éld át az Escape The Horror House izgalmait és borzongását. Kattints az alábbi gombra a játék letöltéséhez!</Text>
                    <Button colorScheme="red" size="lg" onClick={() => window.location.href = '/Game/ETHH.rar'}>
                        Download Now!
                    </Button>
                </Box>

                <SimpleGrid columns={{base: 1, md: 3}} spacing={10} mb={200} className="grid">
                    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={0} className={"card"}
                         onClick={() => handleCardClick("/images/keszajto.png", "GAME INFO #1", "A játékos célja hogy kijusson az elátkozott házból. A játék során a játékosnak meg kell találnia három kart, amelyek a meneküléshez szükséges ajtót nyitják.")}>
                        <div>
                            <img src="/images/keszajto.png" alt="Image 2" className="card-image"/>
                        </div>
                        <Heading className="fej" size="md" mb={2} mt={4}>GAME INFO #1</Heading>
                        <Text className="szoveg">A játékos célja hogy kijusson az elátkozott házból. A játék során a
                            játékosnak meg kell találnia három kart, amelyek a meneküléshez szükséges ajtót
                            nyitják.</Text>
                    </Box>
                    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={0} className={"card"}
                         onClick={() => handleCardClick("/images/HOLAKULCS.png", "GAME INFO #2", "Az út során különböző akadályok és logikai feladatok nehezítik a játékos haladását, amiket le kell küzdenie ha ki szeretne jutni.")}>
                        <div>
                            <img src="/images/HOLAKULCS.png" alt="Image 1" className="card-image"/>
                        </div>
                        <Heading className="fej" size="md" mb={2} mt={4}>GAME INFO #2</Heading>
                        <Text className="szoveg">Az út során különböző akadályok és logikai feladatok nehezítik a
                            játékos haladását, amiket le kell küzdenie ha ki szeretne jutni.</Text>
                    </Box>
                    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={0} className={"card"}
                         onClick={() => handleCardClick("/images/SZELESSZELEM.png", "GAME INFO #3", "VIGYÁZZ! A házban szellemek járnak amik megpróbálnak a szabadulásod útjába állni, kerüld el őket.")}>
                        <div>
                            <img src="/images/SZELESSZELEM.png" alt="Image 3" className="card-image"/>
                        </div>
                        <Heading className="fej" size="md" mb={2} mt={4}>GAME INFO #3</Heading>
                        <Text className="szoveg">VIGYÁZZ! A házban szellemek járnak amik megpróbálnak a szabadulásod
                            útjába állni, kerüld el őket.</Text>
                    </Box>
                </SimpleGrid>

                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay/>
                    <ModalContent
                        className="modal"
                        animation={isOpen ? "modalOpen 0.5s ease-out" : "modalClose 0.5s ease-in"}
                    >
                        <ModalHeader>{selectedHeading}</ModalHeader>
                        <ModalCloseButton className="custom-close-button"/>
                        <ModalBody>
                            <Image src={selectedImage} alt="Selected Image"/>
                            <Text mt={4}>{selectedText}</Text>
                        </ModalBody>
                    </ModalContent>
                </Modal>

                <Heading className="jef" textAlign="center" id="board">Felhasználók</Heading>

                {error && (
                    <Text color="red.500" mb={4}>
                        {error}
                    </Text>
                )}

                {user ? (
                   <Center>
                        <Box w="100%" overflowX="auto" mb={400}>
                            <TableContainer>
                                <Table variant="striped" colorScheme="gray" className="responsive-table">
                                    <Thead>
                                        <Tr>
                                            <Th textAlign="center">Rank</Th>
                                            <Th textAlign="center">Felhasználó</Th>
                                            <Th textAlign="center">Idő</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {users.map((user, index) => (
                                            <Tr key={index}>
                                                <Td textAlign="center">{index + 1 === 1
                                                    ? 'SSS'
                                                    : index + 1 === 2
                                                        ? 'SS'
                                                        : index + 1 === 3
                                                            ? 'S'
                                                            : index + 1
                                                                ? 'A'
                                                                : index > 3 && index < 10
                                                                    ? 'B'
                                                                    : index > 9}</Td>
                                                <Td textAlign="center">{user.username}</Td>
                                                <Td textAlign="center">{user.times}</Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Center>
                ) : (
                    <TableContainer display="flex" justifyContent="center" mb={400} mr={9}>
                        <Table variant="striped" colorScheme="gray">
                            <Thead>
                                <Tr>
                                    <Th textAlign="center"><Link variant="plain"
                                                                 href="/login">Jelentkez
                                        be</Link> hogy lásd a tábla tartalmát!</Th>
                                </Tr>
                            </Thead>
                        </Table>
                    </TableContainer>
                )}

                {user ? (
                  <>
                    <Container maxW="container.lg" py={8} display="flex" flexDirection="column" alignItems="center">
                      <Box width="100%" mb={4}>
                        <Heading size="md" mb={2}>Írd le a véleményed:</Heading>
                        <Box mb={2}>
                          <Text mb={2}>Értékelés:</Text>
                          <HStack spacing={2}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Button
                                key={star}
                                onClick={() => setRating(star)}
                                colorScheme={rating >= star ? "yellow" : "gray"}
                              >
                                ★
                              </Button>
                            ))}
                          </HStack>
                        </Box>
                        <textarea
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            minHeight: "100px",
                            overflowY: "auto",
                          }}
                        />
                      </Box>
                      <Button
                        id="submitFeedback"
                        colorScheme="blue"
                        onClick={handleFeedbackSubmit}
                      >
                        Küldés
                      </Button>
                    </Container>
                    <Container maxW="container.lg" py={8} display="flex" flexDirection="column" alignItems="center">
                      <Heading size="md" mb={4}>Felhasználói visszajelzések:</Heading>
                      <Text mb={4}>Átlagos értékelés: {calculateAverageRating()} ★</Text>
                        <VStack spacing={4} width="100%" maxH="375px" overflowY="auto" id="feedbackContainer">
                            {feedbacks.map((feedback, index) => (
                                <Box key={index} p={4} borderWidth="1px" borderRadius="lg" width="100%" display="flex" justifyContent="space-between" alignItems="center">
                                    <Box>
                                        <HStack spacing={4} align="center">
                                            <Avatar src={feedback.avatar_url || '/images/default-avatar.jpg'} />
                                            <Text fontWeight="bold">{feedback.username}</Text>
                                        </HStack>
                                        <Text mt={2}>Értékelés: {feedback.rating} ★</Text>
                                        <Text mt={2}>{feedback.feedback}</Text>
                                    </Box>
                                    {user && feedback.user_id === user.id && (
                                        <HStack spacing={2}>
                                            <Button colorScheme="red" onClick={() => confirmDeleteFeedback(feedback)}>Delete</Button>
                                        </HStack>
                                    )}
                                </Box>
                            ))}
                        </VStack>

                        <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader>Confirm Deletion</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                              Are you sure you want to delete this feedback?
                            </ModalBody>
                            <ModalFooter>
                              <Button colorScheme="red" onClick={() => handleDeleteFeedback(feedbackToDelete.id)}>Delete</Button>
                              <Button variant="ghost" onClick={onDeleteModalClose}>Cancel</Button>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>
                    </Container>
                  </>
                ) : (
                  <Text color="red.500" mb={4}></Text>
                )}
            </Container>
        </>
    );
}