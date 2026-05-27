/* ==========================================================================
   Churn Detective Dashboard Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ── 1. Tab Navigation ───────────────────────────────────────────────────
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.dashboard-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get target section id
            const targetId = link.getAttribute('href').substring(1);
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active-section'));
            
            // Add active class to clicked link and target section
            link.classList.add('active');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active-section');
                // Scroll to top of main content
                document.querySelector('.main-content').scrollTop = 0;
            }

            // Close mobile sidebar if open
            const sidebar = document.getElementById('app-sidebar');
            sidebar.classList.remove('mobile-open');
        });
    });

    // ── 2. Mobile Sidebar Toggle ───────────────────────────────────────────
    const openSidebarBtn = document.getElementById('open-sidebar-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const sidebar = document.getElementById('app-sidebar');

    if (openSidebarBtn && sidebar) {
        openSidebarBtn.addEventListener('click', () => {
            sidebar.classList.add('mobile-open');
        });
    }

    if (closeSidebarBtn && sidebar) {
        closeSidebarBtn.addEventListener('click', () => {
            sidebar.classList.remove('mobile-open');
        });
    }

    // Close sidebar on clicking outside it (on mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 950 && 
            sidebar.classList.contains('mobile-open') && 
            !sidebar.contains(e.target) && 
            !openSidebarBtn.contains(e.target)) {
            sidebar.classList.remove('mobile-open');
        }
    });

    // ── 3. Interactive ROI Calculator ───────────────────────────────────────
    // Input elements
    const inputTargetSize = document.getElementById('input-target-size');
    const inputMonthlyCharges = document.getElementById('input-monthly-charges');
    const inputOutreachCost = document.getElementById('input-outreach-cost');
    const inputSaveRate = document.getElementById('input-save-rate');

    // Display elements
    const displayTargetSize = document.getElementById('display-target-size');
    const displayMonthlyCharges = document.getElementById('display-monthly-charges');
    const displayOutreachCost = document.getElementById('display-outreach-cost');
    const displaySaveRate = document.getElementById('display-save-rate');

    // Output elements
    const calcCampaignBudget = document.getElementById('calc-campaign-budget');
    const calcGrossSaved = document.getElementById('calc-gross-saved');
    const calcNetSaved = document.getElementById('calc-net-saved');
    const calcRoiPercentage = document.getElementById('calc-roi-percentage');

    function calculateROI() {
        const targetSize = parseInt(inputTargetSize.value);
        const monthlyCharges = parseFloat(inputMonthlyCharges.value);
        const outreachCost = parseFloat(inputOutreachCost.value);
        const saveRate = parseFloat(inputSaveRate.value) / 100;

        // Update slider value displays
        displayTargetSize.textContent = targetSize.toLocaleString();
        displayMonthlyCharges.textContent = `$${monthlyCharges}`;
        displayOutreachCost.textContent = `$${outreachCost}`;
        displaySaveRate.textContent = `${Math.round(saveRate * 100)}%`;

        // Calculate outputs
        // Campaign Budget = Target Size * Outreach Cost per Customer
        const campaignBudget = targetSize * outreachCost;
        
        // Gross Revenue Saved = Target Size * Save Rate * Monthly Charges * 12 Months Contract LTV
        const grossSaved = targetSize * saveRate * monthlyCharges * 12;
        
        // Net Saved Revenue = Gross Revenue Saved - Campaign Budget
        const netSaved = grossSaved - campaignBudget;
        
        // ROI % = (Net Saved / Campaign Budget) * 100
        const roi = campaignBudget > 0 ? (netSaved / campaignBudget) * 100 : 0;

        // Format and display outputs
        calcCampaignBudget.textContent = `$${Math.round(campaignBudget).toLocaleString()}`;
        calcGrossSaved.textContent = `$${Math.round(grossSaved).toLocaleString()}`;
        
        if (netSaved < 0) {
            calcNetSaved.textContent = `-$${Math.abs(Math.round(netSaved)).toLocaleString()}`;
            calcNetSaved.className = 'result-number text-red';
        } else {
            calcNetSaved.textContent = `$${Math.round(netSaved).toLocaleString()}`;
            calcNetSaved.className = 'result-number text-green';
        }

        calcRoiPercentage.textContent = `ROI: ${roi >= 0 ? '+' : ''}${roi.toFixed(1)}%`;
        if (roi < 0) {
            calcRoiPercentage.style.color = 'var(--color-red)';
        } else {
            calcRoiPercentage.style.color = 'var(--color-green)';
        }
    }

    // Attach listeners
    if (inputTargetSize) {
        inputTargetSize.addEventListener('input', calculateROI);
        inputMonthlyCharges.addEventListener('input', calculateROI);
        inputOutreachCost.addEventListener('input', calculateROI);
        inputSaveRate.addEventListener('input', calculateROI);
        
        // Run initial calculation
        calculateROI();
    }
});
