import { useState } from 'react';
    import { Box, Container, Text, Link, Stack, Button, useToast } from '@chakra-ui/react';

    const Footer = () => {
      const toast = useToast();

      const showToast = (event, title, description) => {
        event.preventDefault();
        toast({
          title: title,
          description: (
            <span>
              {description.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </span>
          ),
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
      };

      const copyEmailToClipboard = (event, text) => {
        event.preventDefault();
        navigator.clipboard.writeText(text).then(() => {
          toast({
            title: 'Copied',
            description: 'Email address copied to clipboard.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        });
      };

      const ShowEmail = (event, text, description) => {
        event.preventDefault();
        navigator.clipboard.writeText(text).then(() => {
          toast({
            title: 'Contact',
            description: (
                <span>
          {description.split('\n').map((line, index) => (
              <span key={index}>
              {line}
                <br />
            </span>
          ))}
                  <div style={{ textAlign: 'center' }}>
            <Link href="#" onClick={(e) => copyEmailToClipboard(e, 'ethh.contact@gmail.com')}>ethh.contact@gmail.com</Link>
          </div>
        </span>
            ),
            status: 'info',
            duration: 3000,
            isClosable: true,
          });
        });
      };

      return (
        <Box bg="gray.800" color="white" py={4}>
          <Container maxW="6xl">
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4} justify="space-between" align="center">
              <Text>© {new Date().getFullYear()} ETHH. All rights reserved.</Text>
              <Stack direction="row" spacing={6}>
                <Link href="#" onClick={(e) => showToast(e, 'About Us', 'Cégünk jelenleg két alkalmazottat foglalkoztat...\nBucsa Benjámin: mindenes\nCzentye István: semmis\n')}>About</Link>
                <Link href="#" onClick={(e) => ShowEmail(e, 'ethh.contact@gmail.com', 'Contact us at the following email address:')}>Contact</Link>
                <Link href="#" onClick={(e) => showToast(e, 'Privacy Policy', 'This is the Privacy Policy section content.\nWe value your privacy and are committed to protecting your personal information.\nFor more details, please read our full privacy policy.')}>Privacy Policy</Link>
              </Stack>
            </Stack>
          </Container>
        </Box>
      );
    };

    export default Footer;