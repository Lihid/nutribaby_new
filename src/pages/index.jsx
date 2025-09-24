import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import MealPlanner from "./MealPlanner";

import BabyProfile from "./BabyProfile";

import Chat from "./Chat";

import FeedingLog from "./FeedingLog";

import AgeGuide0to6 from "./AgeGuide0to6";

import AgeGuide6to9 from "./AgeGuide6to9";

import AgeGuide9to12 from "./AgeGuide9to12";

import AgeGuide12to24 from "./AgeGuide12to24";

import ExportRecipes from "./ExportRecipes";

import FirstTastingGuide from "./FirstTastingGuide";

import TastingTrackerPage from "./TastingTrackerPage";

import WaterGuide from "./WaterGuide";

import PickyEatingGuide from "./PickyEatingGuide";

import PreparationGuide from "./PreparationGuide";

import FingerFoodsGuide from "./FingerFoodsGuide";

import FamilyMealsGuide from "./FamilyMealsGuide";

import KitchenInvolvementGuide from "./KitchenInvolvementGuide";

import FullTastingGuide from "./FullTastingGuide";

import TextureGuide from "./TextureGuide";

import MilestonesExport from "./MilestonesExport";

import ChokePreventionGuide from "./ChokePreventionGuide";

import BabySafetyGuide from "./BabySafetyGuide";

import BreastfeedingGuide from "./BreastfeedingGuide";

import FormulaFeedingGuide from "./FormulaFeedingGuide";

import BabyDevelopmentGuide from "./BabyDevelopmentGuide";

import StrawDrinkingGuide from "./StrawDrinkingGuide";

import AdminArticleImages from "./AdminArticleImages";

import SteamingGuide from "./SteamingGuide";

import AdminArticles from "./AdminArticles";

import DynamicArticle from "./DynamicArticle";

import AdminTips from "./AdminTips";

import AgeSpecificArticles from "./AgeSpecificArticles";

import JoinFamily from "./JoinFamily";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    MealPlanner: MealPlanner,
    
    BabyProfile: BabyProfile,
    
    Chat: Chat,
    
    FeedingLog: FeedingLog,
    
    AgeGuide0to6: AgeGuide0to6,
    
    AgeGuide6to9: AgeGuide6to9,
    
    AgeGuide9to12: AgeGuide9to12,
    
    AgeGuide12to24: AgeGuide12to24,
    
    ExportRecipes: ExportRecipes,
    
    FirstTastingGuide: FirstTastingGuide,
    
    TastingTrackerPage: TastingTrackerPage,
    
    WaterGuide: WaterGuide,
    
    PickyEatingGuide: PickyEatingGuide,
    
    PreparationGuide: PreparationGuide,
    
    FingerFoodsGuide: FingerFoodsGuide,
    
    FamilyMealsGuide: FamilyMealsGuide,
    
    KitchenInvolvementGuide: KitchenInvolvementGuide,
    
    FullTastingGuide: FullTastingGuide,
    
    TextureGuide: TextureGuide,
    
    MilestonesExport: MilestonesExport,
    
    ChokePreventionGuide: ChokePreventionGuide,
    
    BabySafetyGuide: BabySafetyGuide,
    
    BreastfeedingGuide: BreastfeedingGuide,
    
    FormulaFeedingGuide: FormulaFeedingGuide,
    
    BabyDevelopmentGuide: BabyDevelopmentGuide,
    
    StrawDrinkingGuide: StrawDrinkingGuide,
    
    AdminArticleImages: AdminArticleImages,
    
    SteamingGuide: SteamingGuide,
    
    AdminArticles: AdminArticles,
    
    DynamicArticle: DynamicArticle,
    
    AdminTips: AdminTips,
    
    AgeSpecificArticles: AgeSpecificArticles,
    
    JoinFamily: JoinFamily,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/MealPlanner" element={<MealPlanner />} />
                
                <Route path="/BabyProfile" element={<BabyProfile />} />
                
                <Route path="/Chat" element={<Chat />} />
                
                <Route path="/FeedingLog" element={<FeedingLog />} />
                
                <Route path="/AgeGuide0to6" element={<AgeGuide0to6 />} />
                
                <Route path="/AgeGuide6to9" element={<AgeGuide6to9 />} />
                
                <Route path="/AgeGuide9to12" element={<AgeGuide9to12 />} />
                
                <Route path="/AgeGuide12to24" element={<AgeGuide12to24 />} />
                
                <Route path="/ExportRecipes" element={<ExportRecipes />} />
                
                <Route path="/FirstTastingGuide" element={<FirstTastingGuide />} />
                
                <Route path="/TastingTrackerPage" element={<TastingTrackerPage />} />
                
                <Route path="/WaterGuide" element={<WaterGuide />} />
                
                <Route path="/PickyEatingGuide" element={<PickyEatingGuide />} />
                
                <Route path="/PreparationGuide" element={<PreparationGuide />} />
                
                <Route path="/FingerFoodsGuide" element={<FingerFoodsGuide />} />
                
                <Route path="/FamilyMealsGuide" element={<FamilyMealsGuide />} />
                
                <Route path="/KitchenInvolvementGuide" element={<KitchenInvolvementGuide />} />
                
                <Route path="/FullTastingGuide" element={<FullTastingGuide />} />
                
                <Route path="/TextureGuide" element={<TextureGuide />} />
                
                <Route path="/MilestonesExport" element={<MilestonesExport />} />
                
                <Route path="/ChokePreventionGuide" element={<ChokePreventionGuide />} />
                
                <Route path="/BabySafetyGuide" element={<BabySafetyGuide />} />
                
                <Route path="/BreastfeedingGuide" element={<BreastfeedingGuide />} />
                
                <Route path="/FormulaFeedingGuide" element={<FormulaFeedingGuide />} />
                
                <Route path="/BabyDevelopmentGuide" element={<BabyDevelopmentGuide />} />
                
                <Route path="/StrawDrinkingGuide" element={<StrawDrinkingGuide />} />
                
                <Route path="/AdminArticleImages" element={<AdminArticleImages />} />
                
                <Route path="/SteamingGuide" element={<SteamingGuide />} />
                
                <Route path="/AdminArticles" element={<AdminArticles />} />
                
                <Route path="/DynamicArticle" element={<DynamicArticle />} />
                
                <Route path="/AdminTips" element={<AdminTips />} />
                
                <Route path="/AgeSpecificArticles" element={<AgeSpecificArticles />} />
                
                <Route path="/JoinFamily" element={<JoinFamily />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}