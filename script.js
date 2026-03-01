const cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});

const links = document.querySelectorAll('a, button');

links.forEach(link => {
  link.addEventListener('mouseenter', () => {
    cursor.style.width  = '28px';
    cursor.style.height = '28px';
    cursor.style.opacity = '0.6';
  });
  link.addEventListener('mouseleave', () => {
    cursor.style.width  = '12px';
    cursor.style.height = '12px';
    cursor.style.opacity = '1';
  });
});

document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
});

const nav = document.querySelector('.side-nav');
const hero = document.querySelector('.hero');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

// show/hide navbar based on hero visibility
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      nav.classList.remove('visible');
    } else {
      nav.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

heroObserver.observe(hero);

// active section tracking
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // remove active from all links
      navLinks.forEach(link => link.classList.remove('active'));

      // add active to matching link
      const id = entry.target.getAttribute('id');
      const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (activeLink) activeLink.classList.add('active');

      // center active item in navbar
      centerActiveLink(activeLink);
    }
  });
}, { threshold: 0.5 });

sections.forEach(section => sectionObserver.observe(section));

// shift nav list so active link is vertically centered
function centerActiveLink(activeLink) {
  if (!activeLink) return;
  const navList = document.querySelector('.side-nav-links');
  const links = Array.from(navLinks);
  const activeIndex = links.indexOf(activeLink);
  const totalLinks = links.length;
  
  // center based on index
  const linkHeight = activeLink.offsetHeight + 28; // 28 is your gap
  const offset = -(activeIndex * linkHeight) + (totalLinks - 1) * linkHeight / 2;
  
  navList.style.transform = `translateY(${offset}px)`;
}

let resizeTimer;

window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const activeLink = document.querySelector('.nav-link.active');
    if (!activeLink) return;
    const target = document.querySelector(activeLink.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'instant' });
  }, 50);
});

const contactDetails = document.querySelectorAll('.contact-detail');

contactDetails.forEach(detail => {
  detail.addEventListener('click', (e) => {
    e.preventDefault();
    
    const href = detail.getAttribute('href');
    const value = href.replace('mailto:', '').replace('tel:', '');
    
    navigator.clipboard.writeText(value).then(() => {
      const original = detail.textContent;
      detail.textContent = 'Copied!';
      detail.style.color = 'var(--accent)';
      
      setTimeout(() => {
        detail.textContent = original;
        detail.style.color = '';
      }, 2000);
    });
  });
});

const form = document.getElementById('contact-form');
const submitBtn = form.querySelector('.form-btn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // change button text while sending
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  const data = new FormData(form);

  try {
    const response = await fetch('https://formspree.io/f/xeelwrzg', {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      submitBtn.textContent = 'Sent!';
      submitBtn.style.borderColor = 'var(--accent-light)';
      submitBtn.style.color = 'var(--accent-light)';
      form.reset();
      
      // reset button after 3 seconds
      setTimeout(() => {
        submitBtn.textContent = 'Send';
        submitBtn.style.borderColor = '';
        submitBtn.style.color = '';
        submitBtn.disabled = false;
      }, 3000);

    } else {
      submitBtn.textContent = 'Failed — Try Again';
      submitBtn.disabled = false;
    }

  } catch {
    submitBtn.textContent = 'Failed — Try Again';
    submitBtn.disabled = false;
  }
});