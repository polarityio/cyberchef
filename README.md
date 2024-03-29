# Polarity CyberChef Integration

![mode:on demand only](https://img.shields.io/badge/mode-on%20demand%20only-blue.svg)

CyberChef is a simple, intuitive web app for carrying out all manner of "cyber" operations within a web browser. These operations include simple encoding like XOR or Base64, more complex encryption like AES, DES and Blowfish, creating binary and hexdumps, compression and decompression of data, calculating hashes and checksums, IPv6 and X.509 parsing, changing character encodings, and much more.

The Polarity CyberChef Integration allows you to leverage much of CyberChefs functionality by searching for any string on demand and enables you build out recipes based on the data you search.

<img src="./assets/cyberchef-demo.gif" alt="CyberChef Demo"  width="400" />

## Options

### CyberChef Url
Add your CyberChef Url to open up the CyberChef dashboard for full functionality. (e.g. https://gchq.github.io/CyberChef)

### Only Show Magic Results
When checked, strings searched that do not immediately have a Magic suggestion will not be displayed in the overlay.

### Ignore Entity Types
When checked, strings searched that are one of our predefined entity types (IPv4, IPv6, IPv4CIDR, MD5, SHA1, SHA256, MAC, string, email, domain, url, and cve) will not be displayed in the overlay.

### Run Magic Function By Default
If checked, when you search a string by default the Magic Function's first recommended Operation will be applied to your input.
No Operation wil be applied if the Magic Function has no suggestions.

### Don't Show Step Results
By default, you can find the results for each step of your recipe when expanding on the Operation's title. If the step results are getting too long you can check this to make only the final output visible in the overlay.

### Minimum Input Length
The minimum text input length for a string to be considered Input.

### Favourite Operations
This is a list of the Favourites that will show up when you initially search for operations.

## Current Limitations
> ***NOTE***: Currently we are excluding a few Features and Operations on the current version of the integration that we plan on implementing and improving in future versions, including:
> 
> - Saving and Loading Recipes
> - Improving searching Operations and the Magic Suggestions
> - We are currently excluding Control Flow Operations including `Comment,  Conditional Jump,  Fork, Jump,  Label, Merge, Register, Return, Subsection`
> - We are also excluding the Operations `AES Decrypt, AES Encrypt, Bombe, Colossus, Enigma, Lorenz, Multiple Bombe, Parse DateTime, RSA Decrypt, RSA Encrypt, SHA2, Tar, Translate DateTime Format, Zip` for the time being. 
> 
> If you feel like any of the current limitations are inhibiting your workflows, please reach out to `support@polarity.io` about what kinds of things you would like added so we can work to include those in our next release!

## Helpful Resources
- Google Timestamp:  https://github.com/mattnotmax/cyberchef-recipes#recipe-6---google-ei-timestamp
- CharCode: https://github.com/mattnotmax/cyberchef-recipes#recipe-3---from-charcode
- Powershell: https://github.com/mattnotmax/cyberchef-recipes#recipe-14---decoding-poshc2-executables
- https://github.com/mattnotmax/cyberchef-recipes
- https://www.networkdefense.co/courses/cyberchef/ - Matt Weiner 

## About Polarity

Polarity is a memory-augmentation platform that improves and accelerates analyst decision making.  For more information about the Polarity platform please see:

https://polarity.io/
