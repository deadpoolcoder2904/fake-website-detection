import sys
import re
import requests
from urllib.parse import urlparse
import numpy as np
import joblib
import warnings
import os
import logging
from bs4 import BeautifulSoup
import socket
import whois
from datetime import datetime
import ssl
import socket

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
warnings.filterwarnings('ignore')

def get_domain_age(domain):
    try:
        w = whois.whois(domain)
        if isinstance(w.creation_date, list):
            creation_date = w.creation_date[0]
        else:
            creation_date = w.creation_date
        
        if creation_date:
            age = (datetime.now() - creation_date).days
            return age
        return -1
    except:
        return -1

def check_ssl_cert(url):
    try:
        hostname = urlparse(url).netloc
        ctx = ssl.create_default_context()
        with ctx.wrap_socket(socket.socket(), server_hostname=hostname) as s:
            s.connect((hostname, 443))
            cert = s.getpeercert()
            return 1 if cert else 0
    except:
        return 0

def extract_features(url):
    try:
        features = []
        parsed = urlparse(url)
        domain = parsed.netloc.lower()
        
        logging.info(f"Extracting features for domain: {domain}")
        
        try:
            response = requests.get(url, timeout=5, verify=False)
            soup = BeautifulSoup(response.text, 'html.parser')
        except:
            response = None
            soup = None

        # 1. having_IP_Address
        features.append(1 if re.match(r'\d+\.\d+\.\d+\.\d+', domain) else 0)
        
        # 2. URL_Length
        features.append(1 if len(url) < 54 else 0)
        
        # 3. Shortening_Service
        shortening_services = ['bit.ly', 'goo.gl', 't.co', 'tinyurl.com', 'is.gd']
        features.append(1 if any(service in domain for service in shortening_services) else 0)
        
        # 4. having_At_Symbol
        features.append(1 if '@' in url else 0)
        
        # 5. double_slash_redirecting
        features.append(1 if url.rfind('//') > 7 else 0)
        
        # 6. Prefix_Suffix
        features.append(1 if '-' in domain else 0)
        
        # 7. having_Sub_Domain
        dots = domain.count('.')
        features.append(1 if dots <= 2 else 0)
        
        # 8. SSLfinal_State
        features.append(check_ssl_cert(url))
        
        # 9. Domain_registration_length
        domain_age = get_domain_age(domain)
        features.append(1 if domain_age > 365 else 0)
        
        # 10. Favicon
        has_favicon = False
        if soup:
            favicon = soup.find('link', rel='icon') or soup.find('link', rel='shortcut icon')
            has_favicon = favicon is not None
        features.append(1 if has_favicon else 0)
        
        # 11. port
        features.append(1 if parsed.port is None else 0)
        
        # 12. HTTPS_token
        features.append(1 if 'https' not in domain else 0)
        
        # 13. Request_URL
        request_url = 0
        if soup:
            imgs = soup.find_all('img', src=True)
            total_imgs = len(imgs)
            external_imgs = sum(1 for img in imgs if not img['src'].startswith(('/', domain)))
            request_url = 1 if total_imgs == 0 or external_imgs/total_imgs < 0.22 else 0
        features.append(request_url)
        
        # 14. URL_of_Anchor
        url_of_anchor = 0
        if soup:
            anchors = soup.find_all('a', href=True)
            total_anchors = len(anchors)
            external_anchors = sum(1 for a in anchors if not a['href'].startswith(('/', domain, '#')))
            url_of_anchor = 1 if total_anchors == 0 or external_anchors/total_anchors < 0.31 else 0
        features.append(url_of_anchor)
        
        # 15. Links_in_tags
        links_in_tags = 0
        if soup:
            meta_scripts_links = soup.find_all(['meta', 'script', 'link'])
            total_links = len(meta_scripts_links)
            external_links = sum(1 for link in meta_scripts_links if link.get('src', '').startswith('http'))
            links_in_tags = 1 if total_links == 0 or external_links/total_links < 0.17 else 0
        features.append(links_in_tags)
        
        # 16. SFH
        sfh = 1  # Default to safe
        if soup:
            forms = soup.find_all('form', action=True)
            for form in forms:
                if form['action'] == "" or form['action'] == "about:blank":
                    sfh = 0
                    break
        features.append(sfh)
        
        # 17. Submitting_to_email
        submitting_to_email = 1
        if soup:
            if soup.find('form', action=re.compile("mailto:", re.I)):
                submitting_to_email = 0
        features.append(submitting_to_email)
        
        # 18. Abnormal_URL
        features.append(1 if domain in url else 0)
        
        # 19. Redirect
        features.append(1 if response is None or len(response.history) <= 1 else 0)
        
        # 20. on_mouseover
        on_mouseover = 1
        if soup:
            if soup.find(onmouseover=True):
                on_mouseover = 0
        features.append(on_mouseover)
        
        # 21. RightClick
        right_click = 1
        if soup:
            if soup.find(oncontextmenu="return false") or soup.find(oncontextmenu="event.preventDefault()"):
                right_click = 0
        features.append(right_click)
        
        # 22. popUpWindow
        popup_window = 1
        if soup:
            if soup.find(onclick=re.compile("window.open", re.I)):
                popup_window = 0
        features.append(popup_window)
        
        # 23. Iframe
        iframe = 1
        if soup:
            if soup.find('iframe'):
                iframe = 0
        features.append(iframe)
        
        # 24. age_of_domain
        features.append(1 if domain_age > 180 else 0)
        
        # 25. DNSRecord
        try:
            socket.gethostbyname(domain)
            features.append(1)
        except:
            features.append(0)
        
        # 26. web_traffic
        features.append(1)  # Default safe value - could be improved with Alexa rank API
        
        # 27. Page_Rank
        features.append(1)  # Default safe value - could be improved with PageRank API
        
        # 28. Google_Index
        features.append(1)  # Default safe value - could be improved with Google Search API
        
        # 29. Links_pointing_to_page
        features.append(1)  # Default safe value - could be improved with backlink checking API
        
        # 30. Statistical_report
        features.append(1)  # Default safe value - could be improved with reputation APIs
        
        logging.info(f"Features extracted successfully: {features}")
        return np.array(features).reshape(1, -1)
    except Exception as e:
        logging.error(f"Error extracting features: {str(e)}")
        raise

def is_known_safe_domain(domain):
    try:
        known_safe = {
            'google.com', 'microsoft.com', 'apple.com', 'amazon.com', 
            'facebook.com', 'github.com', 'linkedin.com', 'twitter.com',
            'instagram.com', 'youtube.com', 'netflix.com', 'spotify.com'
        }
        return any(domain.endswith(safe) for safe in known_safe)
    except Exception as e:
        logging.error(f"Error checking safe domain: {str(e)}")
        return False

def main():
    try:
        if len(sys.argv) != 2:
            logging.error("No URL provided")
            print("0.5")  # Default score if no URL provided
            sys.exit(1)
            
        url = sys.argv[1]
        logging.info(f"Processing URL: {url}")
        
        # Parse domain
        parsed = urlparse(url)
        if not parsed.scheme:
            url = 'http://' + url
            parsed = urlparse(url)
        
        domain = parsed.netloc.lower()
        if not domain:
            logging.error("Invalid URL format")
            print("0.5")
            sys.exit(1)
            
        logging.info(f"Parsed domain: {domain}")
        
        # Check if it's a known safe domain
        if is_known_safe_domain(domain):
            logging.info(f"Known safe domain detected: {domain}")
            print("0.1")  # Very low risk score for known safe domains
            sys.exit(0)
            
        # Extract features
        features = extract_features(url)
        
        # Load model
        model_path = os.path.join(os.path.dirname(__file__), 'url_classifier.joblib')
        if os.path.exists(model_path):
            logging.info("Loading ML model")
            model = joblib.load(model_path)
            score = 1 - model.predict_proba(features)[0][1]  # Inverse probability for phishing score
            logging.info(f"ML model score: {score}")
        else:
            logging.warning("Model not found, using rule-based scoring")
            # Rule-based scoring if no model exists
            score = sum([
                0.2 if len(url) > 100 else 0,
                0.2 if re.match(r'\d+\.\d+\.\d+\.\d+', domain) else 0,
                0.2 if len(domain.split('.')) > 3 else 0,
                0.2 if len(re.findall('[^A-Za-z0-9.]', url)) > 10 else 0,
                0.2 if not parsed.scheme == 'https' else 0
            ])
            logging.info(f"Rule-based score: {score}")
        
        print(score)
        
    except Exception as e:
        logging.error(f"Main error: {str(e)}")
        print("0.5")  # Default score on error
        sys.exit(1)

if __name__ == "__main__":
    main() 