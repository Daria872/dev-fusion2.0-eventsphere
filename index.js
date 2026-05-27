/**
 * EventSphere Core Interactive Engine
 * Responsive client-side routing, canvas particles, card swipe, SVG graphs, and ticketing streams
 */

// Global Active Booking Attributes
let selectedSeat = null;

// Application State
const STATE = {
  user: null, // "attendee", "organizer", or null
  profile: {
    name: "Alex Sterling",
    role: "Premium Member",
    avatar: "assets/alex_sterling_avatar.png"
  },
  tickets: [], // Seeded dynamically
  events: [
    {
      id: "global-ai-hackathon",
      title: "Global AI Hackathon 2026",
      category: "HACKATHON",
      icon: "terminal",
      price: "$250",
      location: "Neo-Tokyo Arena",
      locType: "tokyo",
      date: "JUNE 14-16, 2026",
      img: "assets/hackathon_spotlight.png",
      desc: "Join 5,000 top developers worldwide to build the next generation of autonomous AI systems, neural interfaces, and quantum computing frameworks. Meet venture leaders, work alongside AI researchers, and win over $250k in cash and seed fundings.",
      capacity: "84% Capacity"
    },
    {
      id: "quantum-compute-summit",
      title: "Quantum Compute Summit 2026",
      category: "SUMMIT",
      icon: "memory",
      price: "$499",
      location: "Virtual Stage Cluster B",
      locType: "virtual",
      date: "OCTOBER 08-10, 2026",
      img: "assets/hackathon_spotlight.png",
      desc: "A three-day high-performance digital conference focused on the commercialization of quantum-gate computing arrays and absolute sub-zero cryo-cooling microarchitectures.",
      capacity: "92% Capacity"
    },
    {
      id: "bio-digital-convergence",
      title: "Bio-Digital Convergence",
      category: "KEYNOTE",
      icon: "blur_on",
      price: "$150",
      location: "Paris Cluster Auditorium",
      locType: "paris",
      date: "DECEMBER 03, 2026",
      img: "assets/hackathon_spotlight.png",
      desc: "Explore the intersection of biological neural webs and silicon computing fabrics. Witness live demonstrations of cybernetic biosensors streaming telemetry directly to digital neural models.",
      capacity: "74% Capacity"
    }
  ]
};

// Initializer
document.addEventListener("DOMContentLoaded", () => {
  initState();
  initMouseTracker();
  initParticles();
  initRouter();
  initEventExplorer();
  initTicketing();
  initOrganizerLogs();
  initNetworking();
  initBiometrics();
});

// Load and Store State
function initState() {
  const storedUser = localStorage.getItem("es_user");
  const storedProfile = localStorage.getItem("es_profile");
  const storedTickets = localStorage.getItem("es_tickets");

  if (storedUser) {
    STATE.user = storedUser;
    document.querySelectorAll(".hide-logged-out").forEach(el => el.style.display = "");
    document.querySelectorAll(".show-logged-out").forEach(el => el.style.display = "none");
    
    // Change secure navigation anchor to show dashboard link rather than secure lock
    const secureAnchor = document.getElementById("nav-anchor-secure");
    if (secureAnchor) {
      if (STATE.user === "organizer") {
        secureAnchor.setAttribute("href", "#organizer");
        secureAnchor.querySelector(".material-symbols-outlined").innerText = "insights";
        secureAnchor.querySelector("span:not(.material-symbols-outlined)").innerText = "COMMAND";
      } else {
        secureAnchor.setAttribute("href", "#attendee");
        secureAnchor.querySelector(".material-symbols-outlined").innerText = "confirmation_number";
        secureAnchor.querySelector("span:not(.material-symbols-outlined)").innerText = "TICKETS";
      }
    }
  } else {
    // Force hide secure routes and redirect to access terminal
    document.querySelectorAll(".hide-logged-out").forEach(el => el.style.display = "none");
    document.querySelectorAll(".show-logged-out").forEach(el => el.style.display = "");
    if (!window.location.hash || window.location.hash !== "#login") {
      window.location.hash = "#login";
    }
  }

  if (storedProfile) {
    STATE.profile = JSON.parse(storedProfile);
  } else {
    // Save defaults
    localStorage.setItem("es_profile", JSON.stringify(STATE.profile));
  }

  if (storedTickets) {
    STATE.tickets = JSON.parse(storedTickets);
  } else {
    // Seed one ticket
    STATE.tickets = [{
      eventId: "global-ai-hackathon",
      eventTitle: "Global AI Hackathon 2026",
      date: "JUNE 14-16, 2026",
      location: "Neo-Tokyo Arena",
      tier: "General Entry",
      price: "$250",
      holder: STATE.profile.name,
      ticketId: "TKT-4281-79A"
    }];
    localStorage.setItem("es_tickets", JSON.stringify(STATE.tickets));
  }

  updateProfileDOM();
}

function updateProfileDOM() {
  document.getElementById("header-user-name").innerText = STATE.profile.name;
  document.getElementById("drawer-user-name").innerText = STATE.profile.name;
  document.getElementById("attendee-user-name").innerText = STATE.profile.name;
  
  const roleName = STATE.user === "organizer" ? "PREMIUM ORGANIZER" : "TICKET_HOLDER";
  document.getElementById("header-user-role").innerText = STATE.user ? STATE.user.toUpperCase() : "VISITOR";
  document.getElementById("drawer-user-role").innerText = roleName;
  
  document.getElementById("profile-name-input").value = STATE.profile.name;
  document.getElementById("checkout-name").value = STATE.profile.name;
  
  // Set default avatars if needed
  if (STATE.profile.avatar) {
    document.getElementById("header-avatar-img").src = STATE.profile.avatar;
    document.getElementById("drawer-avatar-img").src = STATE.profile.avatar;
    document.getElementById("attendee-avatar-img").src = STATE.profile.avatar;
  }
}

// ----------------- MOUSE spotlight tracker -----------------
function initMouseTracker() {
  const spotlight = document.getElementById("mouse-spotlight");
  window.addEventListener("mousemove", (e) => {
    spotlight.style.setProperty("--x", `${e.clientX}px`);
    spotlight.style.setProperty("--y", `${e.clientY}px`);
  });
}

// ----------------- GPU-ACCELERATED PARTICLES -----------------
function initParticles() {
  const canvas = document.getElementById("hero-particles");
  if (!canvas) return;
  
  const ctx = canvas.getContext("2d");
  let particles = [];
  let mouse = { x: null, y: null, radius: 180 };

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = (Math.random() * 30) + 15;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * 0.4 - 0.2;
    }

    draw() {
      ctx.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }

    update() {
      // Natural floating movement
      this.x += this.speedX;
      this.y += this.speedY;
      
      // Boundary checking
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

      // Mouse interactive gravity pulling
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          let force = (mouse.radius - distance) / mouse.radius;
          let directionX = forceDirectionX * force * this.density * 0.1;
          let directionY = forceDirectionY * force * this.density * 0.1;
          
          this.x += directionX;
          this.y += directionY;
        }
      }
    }
  }

  function setup() {
    particles = [];
    const num = Math.min(80, Math.floor(canvas.width / 12));
    for (let i = 0; i < num; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    // Draw visual connections between close nodes
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 90) {
          let alpha = (1 - (dist / 90)) * 0.12;
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", () => {
    resize();
    setup();
  });
  
  canvas.parentElement.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.parentElement.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  resize();
  setup();
  animate();
}

// ----------------- CLIENT-SIDE ROUTER (SPA) -----------------
function initRouter() {
  const views = document.querySelectorAll(".page-view");
  const navLinks = document.querySelectorAll(".nav-link");
  const anchors = document.querySelectorAll(".nav-anchor");

  function handleRoute() {
    let hash = window.location.hash.split("?")[0] || "#login";
    
    // Absolute flow gating: force route to login if visitor is unauthenticated
    if (!STATE.user) {
      if (hash !== "#login") {
        showToast("AUTHENTICATION_REQUIRED: Access terminal locked", "lock", "var(--color-secondary)");
        window.location.hash = "#login";
        return;
      }
    } else {
      // Safety redirect on locked routes for signed-in users
      if (hash === "#login") {
        // Redirect authenticated user to appropriate dashboard/home
        window.location.hash = STATE.user === "organizer" ? "#organizer" : "#landing";
        return;
      }
      if (hash === "#attendee" && STATE.user !== "attendee" && STATE.user !== "organizer") {
        showToast("SESSION_LOCKED: Redirecting to terminals", "lock", "var(--color-secondary)");
        window.location.hash = "#login";
        return;
      }
      if (hash === "#organizer" && STATE.user !== "organizer") {
        showToast("ACCESS_DENIED: Elevated privilege required", "security", "var(--color-error)");
        window.location.hash = "#landing";
        return;
      }
    }

    // Toggle active view with fade/slide timing
    views.forEach(view => {
      if (`#${view.id}` === hash) {
        view.classList.add("active");
        // Trigger page-specific animations
        triggerViewAnimation(view.id);
      } else {
        view.classList.remove("active");
      }
    });

    // Update Header Active Links
    navLinks.forEach(link => {
      if (link.getAttribute("href") === hash) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Update Footer Navigation Anchors
    anchors.forEach(anchor => {
      if (anchor.getAttribute("href") === hash) {
        anchor.classList.add("active");
        anchor.style.color = "var(--color-primary)";
      } else {
        anchor.classList.remove("active");
        anchor.style.color = "var(--color-text-secondary)";
      }
    });

    // Handle nested event details route queries
    if (window.location.hash.startsWith("#event-details")) {
      const parts = window.location.hash.split("?id=");
      const eventId = parts[1] || "global-ai-hackathon";
      loadEventDetails(eventId);
    }
    
    // Close drawers on navigate
    document.getElementById("drawer").classList.remove("open");
    document.getElementById("drawer-overlay").classList.remove("open");
  }

  window.addEventListener("hashchange", handleRoute);
  // Trigger on load
  handleRoute();

  // Navigation Profile Drawer interaction
  const profileBtn = document.getElementById("profile-btn");
  const drawer = document.getElementById("drawer");
  const overlay = document.getElementById("drawer-overlay");
  const drawerClose = document.getElementById("drawer-close");

  profileBtn.addEventListener("click", () => {
    drawer.classList.add("open");
    overlay.classList.add("open");
  });

  drawerClose.addEventListener("click", () => {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
  });

  overlay.addEventListener("click", () => {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
  });

  // Logout routine
  document.getElementById("logout-btn").addEventListener("click", () => {
    STATE.user = null;
    localStorage.removeItem("es_user");
    document.querySelectorAll(".hide-logged-out").forEach(el => el.style.display = "none");
    document.querySelectorAll(".show-logged-out").forEach(el => el.style.display = "");
    
    const secureAnchor = document.getElementById("nav-anchor-secure");
    if (secureAnchor) {
      secureAnchor.setAttribute("href", "#login");
      secureAnchor.querySelector(".material-symbols-outlined").innerText = "lock";
      secureAnchor.querySelector("span:not(.material-symbols-outlined)").innerText = "SECURE_SYS";
    }

    showToast("Session terminated cleanly", "exit_to_app", "var(--color-primary)");
    window.location.hash = "#login";
  });
}

function triggerViewAnimation(viewId) {
  if (viewId === "landing") {
    // Dynamic Stats Count-up
    animateValue("counter-attendees", 0, 12800, 1800, "k+");
    animateValue("counter-events", 0, 520, 1800, "+");
  } else if (viewId === "attendee") {
    renderAttendeeTickets();
  } else if (viewId === "organizer") {
    // Restart SVG ring strokes
    document.querySelectorAll(".progress-ring-circle").forEach(circle => {
      const offset = circle.getAttribute("stroke-dashoffset");
      circle.style.strokeDashoffset = 150;
      setTimeout(() => {
        circle.style.strokeDashoffset = offset;
      }, 100);
    });
    // Restart counter inside metric cards
    animateValue("metric-revenue", 0, 124000, 1500, "", true);
    animateValue("metric-tickets", 0, 4281, 1500);
    animateValue("metric-live", 0, 850, 1000);
  }
}

// Stats counter logic
function animateValue(id, start, end, duration, suffix = "", isCurrency = false) {
  const obj = document.getElementById(id);
  if (!obj) return;
  
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    let val = Math.floor(progress * (end - start) + start);
    
    if (isCurrency) {
      obj.innerHTML = "$" + val.toLocaleString();
    } else if (suffix === "k+") {
      // Formatted as 12.8k+
      obj.innerHTML = (val / 1000).toFixed(1) + suffix;
    } else {
      obj.innerHTML = val.toLocaleString() + suffix;
    }
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// ----------------- EXPLORE EVENTS -----------------
function initEventExplorer() {
  const container = document.getElementById("explore-cards-container");
  const searchInput = document.getElementById("search-input");
  const countLabel = document.getElementById("explore-results-count");
  
  function renderExplorer() {
    if (!container) return;
    const searchVal = searchInput.value.toLowerCase();
    
    // Checkboxes checked
    const checkedCats = Array.from(document.querySelectorAll(".filter-cat:checked")).map(el => el.value);
    const checkedLocs = Array.from(document.querySelectorAll(".filter-loc:checked")).map(el => el.value);
    
    let filtered = STATE.events.filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchVal) || e.desc.toLowerCase().includes(searchVal);
      const matchesCat = checkedCats.includes(e.category.toLowerCase());
      const matchesLoc = checkedLocs.includes(e.locType);
      return matchesSearch && matchesCat && matchesLoc;
    });

    container.innerHTML = "";
    countLabel.innerText = `Showing ${filtered.length} Event${filtered.length === 1 ? '' : 's'}`;

    if (filtered.length === 0) {
      container.innerHTML = `<div class="glass-card" style="grid-column: span 3; text-align:center; padding: 48px;">
        <span class="material-symbols-outlined" style="font-size:48px; color: var(--color-text-secondary);">info</span>
        <p style="margin-top:16px;">NO_MATCHING_CHANNELS: Please widen filter attributes</p>
      </div>`;
      return;
    }

    filtered.forEach(e => {
      const card = document.createElement("div");
      card.className = "glass-panel glass-card event-card";
      card.style.borderRadius = "var(--radius-xl)";
      card.innerHTML = `
        <img src="${e.img}" alt="${e.title}" class="event-card-img">
        <div class="event-card-details">
          <div class="event-card-cat">
            <span class="material-symbols-outlined" style="font-size: 13px; vertical-align: middle; margin-right: 4px;">${e.icon}</span>
            <span>${e.category}</span>
          </div>
          <h3 class="event-card-title">${e.title}</h3>
          <p class="event-card-desc">${e.desc}</p>
          <div class="event-card-footer">
            <span style="font-family:var(--font-mono); color:var(--color-primary); font-weight:bold;">${e.price}</span>
            <a href="#event-details?id=${e.id}" class="btn-primary" style="padding: 8px 16px; font-size:12px;">OPEN_PORTAL</a>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Bind Listeners
  if (searchInput) {
    searchInput.addEventListener("input", renderExplorer);
    document.querySelectorAll(".filter-checkbox").forEach(chk => {
      chk.addEventListener("change", renderExplorer);
    });
  }
  
  // Seed first run
  renderExplorer();
}

// ----------------- EVENT DETAILS & CHECKOUT -----------------
let activeBookingEvent = null;
let selectedTicketTier = { tier: "General Entry", price: "$250" };

function loadEventDetails(id) {
  const ev = STATE.events.find(e => e.id === id);
  if (!ev) return;
  
  activeBookingEvent = ev;
  document.getElementById("details-img").src = ev.img;
  document.getElementById("details-title").innerText = ev.title;
  document.getElementById("details-cat-label").innerText = ev.category;
  document.getElementById("details-icon").innerText = ev.icon;
  document.getElementById("details-long-desc").innerText = ev.desc;

  // Custom tiers setup
  const tiersContainer = document.getElementById("tiers-container");
  tiersContainer.innerHTML = `
    <div class="tier-item selected" data-tier="General Entry" data-price="${ev.price}">
      <div>
        <div class="tier-name">General Entry</div>
        <p style="font-size:10px; color:var(--color-text-secondary); margin-top:2px;">Standard admission access grids</p>
      </div>
      <div class="tier-price">${ev.price}</div>
    </div>
    <div class="tier-item" data-tier="VIP Elite" data-price="$850">
      <div>
        <div class="tier-name">VIP Elite Keynote</div>
        <p style="font-size:10px; color:var(--color-text-secondary); margin-top:2px;">Stage-side pod & biometric logs</p>
      </div>
      <div class="tier-price">$850</div>
    </div>
    <div class="tier-item" style="opacity:0.45; cursor:not-allowed;" data-sold-out="true">
      <div>
        <div class="tier-name">Early Bird discounts</div>
        <p style="font-size:10px; color:var(--color-text-secondary); margin-top:2px;">Pre-sale allocations</p>
      </div>
      <div class="tier-price">SOLD_OUT</div>
    </div>
  `;

  selectedTicketTier = { tier: "General Entry", price: ev.price };
  document.getElementById("details-selected-price").innerText = ev.price;

  // Render Seat Grid Selector dynamically
  const seatGrid = document.getElementById("details-seat-grid");
  const seatSection = document.getElementById("seat-booking-section");
  const selectedSeatSpan = document.getElementById("details-selected-seat");
  
  if (seatGrid && seatSection) {
    seatSection.style.display = "block";
    seatGrid.innerHTML = "";
    selectedSeatSpan.innerText = "NONE";
    selectedSeat = null;

    const rows = ["A", "B", "C", "D"];
    const seatsPerRow = 6;
    const bookedSeats = ["A3", "A5", "B2", "C4", "C6", "D1", "D5"]; // Seed realistic taken seats

    rows.forEach(row => {
      const isVipRow = (row === "A" || row === "B");
      for (let s = 1; s <= seatsPerRow; s++) {
        const seatCode = `${row}${s}`;
        const isBooked = bookedSeats.includes(seatCode);
        
        const seatBtn = document.createElement("button");
        seatBtn.className = "font-mono";
        seatBtn.innerText = seatCode;
        seatBtn.style.padding = "6px 2px";
        seatBtn.style.fontSize = "10px";
        seatBtn.style.borderRadius = "var(--radius-sm)";
        seatBtn.style.border = "1px solid rgba(255,255,255,0.1)";
        seatBtn.style.cursor = "pointer";
        seatBtn.style.transition = "var(--transition-fast)";
        
        if (isBooked) {
          seatBtn.style.background = "rgba(255, 255, 255, 0.04)";
          seatBtn.style.color = "rgba(255, 255, 255, 0.12)";
          seatBtn.style.borderColor = "transparent";
          seatBtn.style.cursor = "not-allowed";
          seatBtn.disabled = true;
        } else {
          seatBtn.style.background = "rgba(5, 20, 36, 0.8)";
          seatBtn.style.color = isVipRow ? "var(--color-secondary-dim)" : "var(--color-text-primary)";
          
          seatBtn.addEventListener("click", (e) => {
            e.preventDefault();
            // Validate tier
            const currentTier = selectedTicketTier.tier;
            const isVipTier = (currentTier === "VIP Elite" || currentTier === "VIP Elite Keynote");
            
            if (isVipTier && !isVipRow) {
              showToast("TIER_ERROR: VIP ticket requires Row A or B", "info", "var(--color-secondary)");
              return;
            }
            if (!isVipTier && isVipRow) {
              showToast("TIER_ERROR: General ticket requires Row C or D", "info", "var(--color-secondary)");
              return;
            }

            // Reset other buttons visual states
            seatGrid.querySelectorAll("button").forEach(btn => {
              if (!btn.disabled) {
                const bSeat = btn.innerText;
                const bIsVipRow = (bSeat.startsWith("A") || bSeat.startsWith("B"));
                btn.style.background = "rgba(5, 20, 36, 0.8)";
                btn.style.borderColor = "rgba(255,255,255,0.1)";
                btn.style.color = bIsVipRow ? "var(--color-secondary-dim)" : "var(--color-text-primary)";
                btn.style.boxShadow = "none";
              }
            });

            // Set active state
            seatBtn.style.background = "var(--color-primary)";
            seatBtn.style.color = "var(--color-text-dark)";
            seatBtn.style.borderColor = "var(--color-primary)";
            seatBtn.style.boxShadow = "0 0 10px rgba(0, 240, 255, 0.5)";
            
            selectedSeat = seatCode;
            selectedSeatSpan.innerText = seatCode;
            
            showToast(`Seat selected: ${seatCode}`, "chair", "var(--color-primary)");
          });
        }
        seatGrid.appendChild(seatBtn);
      }
    });
  }

  // Bind selection toggles
  document.querySelectorAll("#tiers-container .tier-item:not([data-sold-out])").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll("#tiers-container .tier-item").forEach(t => t.classList.remove("selected"));
      item.classList.add("selected");
      
      const tier = item.getAttribute("data-tier");
      const price = item.getAttribute("data-price");
      selectedTicketTier = { tier, price };
      document.getElementById("details-selected-price").innerText = price;

      // Reset selected seat on tier switch
      if (selectedSeatSpan) selectedSeatSpan.innerText = "NONE";
      selectedSeat = null;
      if (seatGrid) {
        seatGrid.querySelectorAll("button").forEach(btn => {
          if (!btn.disabled) {
            const bSeat = btn.innerText;
            const bIsVipRow = (bSeat.startsWith("A") || bSeat.startsWith("B"));
            btn.style.background = "rgba(5, 20, 36, 0.8)";
            btn.style.borderColor = "rgba(255,255,255,0.1)";
            btn.style.color = bIsVipRow ? "var(--color-secondary-dim)" : "var(--color-text-primary)";
            btn.style.boxShadow = "none";
          }
        });
      }
    });
  });
}

function initTicketing() {
  const modal = document.getElementById("checkout-modal");
  const checkoutBtn = document.getElementById("btn-register-checkout");
  const closeBtn = document.getElementById("checkout-close");
  const backdrop = document.getElementById("checkout-backdrop");
  const checkoutForm = document.getElementById("checkout-form");

  if (!checkoutBtn) return;

  // Form input binders mapping to visual credit card
  document.getElementById("checkout-name").addEventListener("input", (e) => {
    document.getElementById("cc-card-holder").innerText = e.target.value.toUpperCase() || "ALEX STERLING";
  });
  
  document.getElementById("checkout-cardnum").addEventListener("input", (e) => {
    // Add spacer every 4 chars
    let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formatted = val.match(/.{1,4}/g);
    e.target.value = formatted ? formatted.join(' ') : '';
    document.getElementById("cc-card-number").innerText = e.target.value || "•••• •••• •••• 4281";
  });

  document.getElementById("checkout-expiry").addEventListener("input", (e) => {
    let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (val.length > 2) {
      e.target.value = val.substring(0, 2) + '/' + val.substring(2, 4);
    } else {
      e.target.value = val;
    }
    document.getElementById("cc-card-expiry").innerText = e.target.value ? `EXP ${e.target.value}` : "EXP 12/29";
  });

  checkoutBtn.addEventListener("click", () => {
    if (!STATE.user) {
      showToast("SECURE_SHELL: Please login to checkout", "lock", "var(--color-secondary)");
      window.location.hash = "#login";
      return;
    }
    if (!selectedSeat) {
      showToast("BOOKING_ERROR: Please select an available seat first", "chair", "var(--color-secondary)");
      return;
    }
    modal.classList.add("open");
  });

  const closeModal = () => modal.classList.remove("open");
  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);

  // Submit payment
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const payBtn = document.getElementById("btn-submit-payment");
    payBtn.innerText = "AUTHORIZING_HASH...";
    payBtn.disabled = true;

    // Simulated network delay
    setTimeout(() => {
      const ticketId = "TKT-" + Math.floor(1000 + Math.random() * 9000) + "-" + Math.floor(10 + Math.random() * 89) + "X";
      
      const newTicket = {
        eventId: activeBookingEvent.id,
        eventTitle: activeBookingEvent.title,
        date: activeBookingEvent.date,
        location: activeBookingEvent.location,
        tier: selectedTicketTier.tier,
        price: selectedTicketTier.price,
        holder: document.getElementById("checkout-name").value || STATE.profile.name,
        ticketId: ticketId,
        seat: selectedSeat
      };

      STATE.tickets.push(newTicket);
      localStorage.setItem("es_tickets", JSON.stringify(STATE.tickets));
      
      // Update name if changed
      if (document.getElementById("checkout-name").value) {
        STATE.profile.name = document.getElementById("checkout-name").value;
        localStorage.setItem("es_profile", JSON.stringify(STATE.profile));
        updateProfileDOM();
      }

      closeModal();
      showToast(`Pass Generated: ${ticketId}`, "check_circle", "var(--color-success)");
      
      // Reset form
      payBtn.innerText = "CONFIRM_TRANSACTION";
      payBtn.disabled = false;
      document.getElementById("checkout-cardnum").value = "";
      document.getElementById("checkout-expiry").value = "";
      document.getElementById("checkout-cvv").value = "";
      
      // Navigate to attendee dashboard to inspect ticket
      window.location.hash = "#attendee";
    }, 2000);
  });

  // Profile update submit
  document.getElementById("btn-save-profile").addEventListener("click", () => {
    const inputVal = document.getElementById("profile-name-input").value;
    if (inputVal.trim()) {
      STATE.profile.name = inputVal.trim();
      localStorage.setItem("es_profile", JSON.stringify(STATE.profile));
      updateProfileDOM();
      showToast("Profile identity synchronized", "sync", "var(--color-primary)");
    }
  });
}

// Render dynamic tickets in Attendee portal
function renderAttendeeTickets() {
  const container = document.getElementById("tickets-container-list");
  if (!container) return;

  container.innerHTML = "";

  if (STATE.tickets.length === 0) {
    container.innerHTML = `<div class="glass-card text-center" style="padding: 48px;">
      <span class="material-symbols-outlined" style="font-size: 48px; color: var(--color-text-secondary);">airplane_ticket</span>
      <p style="margin-top: 16px;">NO_ACTIVE_TICKETS: Secure your credentials in the explore catalog</p>
      <a href="#explore" class="btn-primary" style="margin-top: 24px;">Explore Events</a>
    </div>`;
    return;
  }

  // Map and append tickets
  STATE.tickets.forEach(t => {
    const card = document.createElement("div");
    card.className = "ticket-stub glass-panel";
    
    // Dynamic SVG barcode generator
    const svgBar = generateBarcodeSVG(t.ticketId);

    card.innerHTML = `
      <div class="ticket-main">
        <div>
          <span class="font-mono text-gradient" style="font-size:10px; font-weight:bold;">${t.tier.toUpperCase()}</span>
          <h3 style="font-size: 22px; margin-top:8px; line-height:1.2;">${t.eventTitle}</h3>
          <p class="font-mono" style="font-size:10px; color:var(--color-primary); margin-top:8px;">${t.date}</p>
        </div>
        <div style="margin-top:24px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <div>
              <p class="font-mono" style="font-size:9px; color:var(--color-text-secondary);">HOLDER_NAME</p>
              <p style="font-size:13px; font-weight:bold; color:#fff;">${t.holder}</p>
            </div>
            <div style="text-align:right;">
              <p class="font-mono" style="font-size:9px; color:var(--color-text-secondary);">SEAT_CODE</p>
              <p style="font-size:13px; font-weight:bold; color:var(--color-primary);">${t.seat || 'GENERAL'}</p>
            </div>
          </div>
          <p class="font-mono" style="font-size:9px; color:var(--color-text-secondary);">VENUE_GPS</p>
          <p style="font-size:13px; color:var(--color-text-secondary);">${t.location}</p>
        </div>
      </div>
      <div class="ticket-barcode-side">
        <div style="text-align:center;">
          <div style="background:#fff; padding:12px; border-radius: var(--radius-lg); margin:0 auto 12px; display:inline-block;">
            ${svgBar}
          </div>
          <span class="font-mono" style="font-size:10px; color:var(--color-primary); display:block;">${t.ticketId}</span>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Simple barcode/QR placeholder generator
function generateBarcodeSVG(id) {
  // Simple static matrix code generator for nice visual look
  let paths = "";
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if ((i + j) % 2 === 0 || Math.random() > 0.4) {
        paths += `<rect x="${i * 20 + 5}" y="${j * 20 + 5}" width="15" height="15" fill="var(--color-text-dark)"/>`;
      }
    }
  }
  // Add corner trackers
  return `<svg width="90" height="90" viewBox="0 0 90 90">
    <rect x="0" y="0" width="90" height="90" fill="#fff"/>
    <rect x="5" y="5" width="20" height="20" fill="#000" stroke="#000" stroke-width="2"/>
    <rect x="10" y="10" width="10" height="10" fill="#fff"/>
    <rect x="65" y="5" width="20" height="20" fill="#000" stroke="#000" stroke-width="2"/>
    <rect x="70" y="10" width="10" height="10" fill="#fff"/>
    <rect x="5" y="65" width="20" height="20" fill="#000" stroke="#000" stroke-width="2"/>
    <rect x="10" y="70" width="10" height="10" fill="#fff"/>
    <rect x="35" y="35" width="20" height="20" fill="#000"/>
    <rect x="45" y="20" width="10" height="15" fill="#000"/>
    <rect x="20" y="45" width="15" height="10" fill="#000"/>
  </svg>`;
}

// ----------------- LOGIN TERMINAL BIOMETRICS -----------------
function initBiometrics() {
  const bioBox = document.getElementById("biometric-box");
  const bioIcon = document.getElementById("biometric-icon");
  const bioText = document.getElementById("biometric-text");

  if (!bioBox) return;

  bioBox.addEventListener("click", () => {
    bioIcon.innerText = "fingerprint";
    bioText.innerText = "SCANNING_RETAIN_STILL";
    bioBox.style.borderColor = "var(--color-secondary)";
    
    setTimeout(() => {
      bioIcon.innerText = "verified";
      bioText.innerText = "BIOMETRICS_MATCHED";
      bioBox.style.borderColor = "var(--color-success)";
      
      // Auto routing based on username or role toggles
      setTimeout(() => {
        // Assume attendee by default, unless specific string
        const valName = document.getElementById("login-username").value || "Alex Sterling";
        STATE.user = "organizer"; // Biometrics on organizer computer logins to organizer dashboard
        localStorage.setItem("es_user", STATE.user);
        
        STATE.profile.name = valName;
        localStorage.setItem("es_profile", JSON.stringify(STATE.profile));
        
        initState();
        showToast("Access authenticated successfully", "verified", "var(--color-success)");
        window.location.hash = "#organizer";
      }, 1000);
    }, 2500);
  });

  // Wire manual login buttons
  document.getElementById("btn-login-attendee").addEventListener("click", () => {
    const valName = document.getElementById("login-username").value || "Visitor Pass";
    STATE.user = "attendee";
    localStorage.setItem("es_user", STATE.user);
    
    STATE.profile.name = valName;
    localStorage.setItem("es_profile", JSON.stringify(STATE.profile));
    
    initState();
    showToast("Attendee channel authorized", "done", "var(--color-primary)");
    window.location.hash = "#landing";
  });

  document.getElementById("btn-login-organizer").addEventListener("click", () => {
    const valName = document.getElementById("login-username").value || "Alex Sterling";
    STATE.user = "organizer";
    localStorage.setItem("es_user", STATE.user);
    
    STATE.profile.name = valName;
    localStorage.setItem("es_profile", JSON.stringify(STATE.profile));
    
    initState();
    showToast("Command center session authorized", "insights", "var(--color-success)");
    window.location.hash = "#organizer";
  });
}

// ----------------- ORGANIZER COMMAND METRICS LOGS -----------------
function initOrganizerLogs() {
  const container = document.getElementById("operations-log-container");
  if (!container) return;

  const mockLogNames = ["Sarah Jenkins", "Thomas Anderson", "Ada Lovelace", "Linus Torvalds", "Grace Hopper", "Alan Turing"];
  const mockLogSectors = ["Symmetry Gate", "North Lobby", "Portal Sector A", "Main Dome Alpha", "Vip Pod B"];
  
  // Tick a periodic new log entry simulating active arena
  setInterval(() => {
    if (window.location.hash !== "#organizer" || !container) return;

    const rName = mockLogNames[Math.floor(Math.random() * mockLogNames.length)];
    const rSector = mockLogSectors[Math.floor(Math.random() * mockLogSectors.length)];
    const roll = Math.random();

    let logHTML = "";
    let alertClass = "log-primary";

    if (roll > 0.6) {
      // VIP check in
      logHTML = `
        <div style="width:36px; height:36px; border-radius:var(--radius-sm); background:rgba(0,240,255,0.1); display:flex; align-items:center; justify-content:center; shrink:0;">
          <span class="material-symbols-outlined" style="font-size:18px; color:var(--color-primary);">qr_code_scanner</span>
        </div>
        <div>
          <p style="font-size:13px; color:#fff;"><span style="font-weight:bold; color:var(--color-primary);">VIP Checked-in:</span> ${rName}</p>
          <p class="font-mono" style="font-size:9px; color:var(--color-text-secondary); margin-top:2px;">${rSector.toUpperCase()} • JUST NOW</p>
        </div>
      `;
      alertClass = "log-primary";
      // Increment live metric
      const liveCounter = document.getElementById("metric-live");
      if (liveCounter) {
        let val = parseInt(liveCounter.innerText) + 1;
        liveCounter.innerText = val;
        document.getElementById("live-users-counter").innerText = val;
      }
    } else if (roll > 0.25) {
      // Purchase log
      const qty = Math.floor(Math.random() * 2) + 1;
      logHTML = `
        <div style="width:36px; height:36px; border-radius:var(--radius-sm); background:rgba(138,43,226,0.1); display:flex; align-items:center; justify-content:center; shrink:0;">
          <span class="material-symbols-outlined" style="font-size:18px; color:var(--color-secondary-dim);">shopping_cart</span>
        </div>
        <div>
          <p style="font-size:13px; color:#fff;"><span style="font-weight:bold; color:var(--color-secondary-dim);">New Registration:</span> ${qty}x General Pass</p>
          <p class="font-mono" style="font-size:9px; color:var(--color-text-secondary); margin-top:2px;">SYS_PORTAL • JUST NOW</p>
        </div>
      `;
      alertClass = "log-secondary";
      // Increment booking metrics
      const ticketsMetric = document.getElementById("metric-tickets");
      const revMetric = document.getElementById("metric-revenue");
      if (ticketsMetric && revMetric) {
        ticketsMetric.innerText = (parseInt(ticketsMetric.innerText) + qty).toLocaleString();
        let curRev = parseInt(revMetric.innerText.replace(/[^0-9]/g, ''));
        revMetric.innerText = "$" + (curRev + (qty * 250)).toLocaleString();
      }
    } else {
      // Telem alert log
      logHTML = `
        <div style="width:36px; height:36px; border-radius:var(--radius-sm); background:rgba(255,180,171,0.1); display:flex; align-items:center; justify-content:center; shrink:0;">
          <span class="material-symbols-outlined" style="font-size:18px; color:var(--color-error);">wifi</span>
        </div>
        <div>
          <p style="font-size:13px; color:#fff;"><span style="font-weight:bold; color:var(--color-error);">System:</span> Gateway Telemetry Ping Balanced</p>
          <p class="font-mono" style="font-size:9px; color:var(--color-text-secondary); margin-top:2px;">NET_DAEMON • JUST NOW</p>
        </div>
      `;
      alertClass = "log-primary";
    }

    const item = document.createElement("div");
    item.className = `log-item ${alertClass}`;
    item.style.opacity = 0;
    item.style.transform = "translateY(-10px)";
    item.innerHTML = logHTML;
    
    container.insertBefore(item, container.firstChild);
    
    // Animate insertion
    setTimeout(() => {
      item.style.opacity = 1;
      item.style.transform = "translateY(0)";
    }, 50);

    // Keep list clean
    if (container.children.length > 25) {
      container.removeChild(container.lastChild);
    }
  }, 4500);

  // Seat/Sector Heatmap Clicks
  document.querySelectorAll(".heatmap-sector").forEach(sect => {
    sect.addEventListener("click", () => {
      const name = sect.getAttribute("data-sector");
      const cap = sect.getAttribute("data-capacity");
      const count = sect.getAttribute("data-count");
      showToast(`SECTOR_ALERT: ${name} is currently at ${cap} (${count} inside)`, "sensors", "var(--color-primary)");
    });
  });
}

// ----------------- AI MATCHMAKING CARD SWIPING -----------------
function initNetworking() {
  const stack = document.getElementById("networking-card-stack");
  const leftBtn = document.getElementById("btn-swipe-left");
  const rightBtn = document.getElementById("btn-swipe-right");

  if (!stack) return;

  let currentCardIndex = 0;

  function handleSwipe(direction) {
    const cards = stack.querySelectorAll(".holo-card");
    if (currentCardIndex >= cards.length) {
      showToast("HOLO_STACK_EMPTY: Generating further AI models", "diversity_3", "var(--color-secondary)");
      // Recycle/reset deck for infinite demo
      resetDeck();
      return;
    }

    const activeCard = cards[currentCardIndex];
    
    if (direction === "right") {
      activeCard.style.transform = "translateX(400px) rotate(45deg) scale(0.9)";
      activeCard.style.opacity = 0;
      
      const personName = activeCard.querySelector("h4").innerText;
      setTimeout(() => {
        showToast(`AI MATCH FOUND: ${personName} swapped digital cards`, "favorite", "var(--color-success)");
      }, 350);
    } else {
      activeCard.style.transform = "translateX(-400px) rotate(-45deg) scale(0.9)";
      activeCard.style.opacity = 0;
    }

    currentCardIndex++;

    // Reorder subsequent cards visually
    setTimeout(() => {
      const remaining = Array.from(cards).slice(currentCardIndex);
      remaining.forEach((card, idx) => {
        card.className = "glass-panel holo-card";
        if (idx === 0) {
          card.classList.add("top");
          // Add scanning line to new top card
          const scan = document.createElement("div");
          scan.className = "scanner-line";
          card.appendChild(scan);
        } else if (idx === 1) {
          card.classList.add("middle");
        } else {
          card.classList.add("bottom");
        }
      });
    }, 250);
  }

  function resetDeck() {
    const cards = stack.querySelectorAll(".holo-card");
    currentCardIndex = 0;
    cards.forEach((card, idx) => {
      card.style.transform = "";
      card.style.opacity = "";
      card.className = "glass-panel holo-card";
      
      // Clean old scanners
      const oldScan = card.querySelector(".scanner-line");
      if (oldScan) oldScan.remove();

      if (idx === 0) {
        card.classList.add("top");
        const scan = document.createElement("div");
        scan.className = "scanner-line";
        card.appendChild(scan);
      } else if (idx === 1) {
        card.classList.add("middle");
      } else {
        card.classList.add("bottom");
      }
    });
  }

  if (leftBtn) {
    leftBtn.addEventListener("click", () => handleSwipe("left"));
    rightBtn.addEventListener("click", () => handleSwipe("right"));
  }
}

// ----------------- TOAST BANNER NOTIFICATIONS -----------------
let toastTimeout;
function showToast(message, iconName = "info", color = "var(--color-primary)") {
  const toast = document.getElementById("toast-alert");
  const icon = document.getElementById("toast-icon");
  const msgEl = document.getElementById("toast-message");

  if (!toast) return;

  clearTimeout(toastTimeout);
  
  icon.innerText = iconName;
  icon.style.color = color;
  toast.style.borderColor = color;
  msgEl.innerText = message;
  
  // Trigger slide-in bounce
  toast.style.opacity = 1;
  toast.style.transform = "translateX(-50%) translateY(0)";

  toastTimeout = setTimeout(() => {
    toast.style.opacity = 0;
    toast.style.transform = "translateX(-50%) translateY(-100px)";
  }, 4000);
}

/* =========================================================
   RAZORPAY PAYMENT GATEWAY INTEGRATION
========================================================= */

const razorpayButton = document.getElementById("btn-submit-payment");

if (razorpayButton) {

  razorpayButton.addEventListener("click", async function () {

    const customerName =
      document.getElementById("checkout-name").value || "Guest User";

    let ticketPrice =
      document.getElementById("details-selected-price").innerText;

    ticketPrice = ticketPrice.replace("$", "");

    let amount = parseInt(ticketPrice);

    amount = amount * 85;

    const selectedSeat =
      document.getElementById("details-selected-seat").innerText || "GENERAL";

    const options = {

      key: "rzp_test_SuK7TQ20Oci7Ax",

      amount: amount * 100,

      currency: "INR",

      name: "EventSphere",

      description: "Immersive Event Booking",

      image: "assets/logo.png",

      handler: function (response) {

        console.log("PAYMENT SUCCESS");

        console.log(response);

        alert("Payment Successful!");

      },

      prefill: {

        name: customerName,

        email: "alex@eventsphere.ai",

        contact: "9999999999"

      },

      notes: {

        seat: selectedSeat

      },

      theme: {

        color: "#00f0ff"

      }

    };

    const rzp = new Razorpay(options);

    rzp.open();

  });

}