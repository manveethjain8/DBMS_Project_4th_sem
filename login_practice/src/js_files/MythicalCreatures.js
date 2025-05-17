import React, { useState, useEffect, useContext } from 'react';
import '../css_files/MythicalCreatures.css';
import { Link, useNavigate } from 'react-router-dom';
import api1 from '../api/axios1';
import { DataContext } from '../context/dataContext';
import SideWindow from './SideWindow';

const MythicalCreatures = () => {
    const navigate = useNavigate();
    const {mythicalCreatures,loggedInUser, totalCreatures, setTotalCreatures, cart, setCart } = useContext(DataContext);

    const [filteredMythicalCreatures, setFilteredMythicalCreatures] = useState([]);
    const [searchSelectedCreature, setSearchSelectedCreature] = useState('');
    const [moreInformationOpen, setMoreInformationOpen] = useState(false);
    const [moreInfoSelectedCreature, setMoreInfoSelectedCreature] = useState(null);
    const [selectedCreatureId, setSelectedCreatureId] = useState('');

    useEffect(() => {
        console.log("loggedInUser:", loggedInUser);
    }, [loggedInUser]);


    
    useEffect(() => {
        const filtered = mythicalCreatures.filter(creature =>
            creature.name.toLowerCase().includes(searchSelectedCreature.toLowerCase())
        );
        setFilteredMythicalCreatures(filtered);
    }, [searchSelectedCreature, mythicalCreatures]);

    const handleMoreInformation = (id) => {
        const creature = mythicalCreatures.find(c => c._id === id);
        setMoreInfoSelectedCreature(creature);
        setMoreInformationOpen(true);
    };

    useEffect(() => {
        if (!selectedCreatureId) return;
    
        const handleAddToCart = async () => {
            if (!loggedInUser) {
                navigate('/');
                return;
            }
    
            try {
                const selected = mythicalCreatures.find(c => c._id === selectedCreatureId);
    
                await api1.post('/cart/add-to-cart', {
                    userId: loggedInUser.id,
                    creatureId: selected._id,
                    name: selected.name,
                    cost: selected.cost,
                    description: selected.description,
                    image: selected.images.creature
                });
    
                // Now refetch the cart to get updated total quantity
                const updatedCart = await api1.get(`/cart/${loggedInUser.id}`);
                const totalQty = updatedCart.data.reduce((sum, item) => sum + item.quantity, 0);
                console.log(updatedCart.data);
                setTotalCreatures(totalQty);
                setCart(updatedCart.data);
            } catch (error) {
                console.error('Error updating cart', error);
                alert('Failed to add creature to cart.');
            }
    
            setSelectedCreatureId('');
        };
    
        handleAddToCart();
    }, [selectedCreatureId, loggedInUser, mythicalCreatures, setTotalCreatures, navigate]);
    

    return (
        <div className='mythicalCreaturesPageBackground'>
            <div className='mythicalCreaturesOverlay'></div>
            <div className='mythicalCreaturesHeader'>
                <Link to='/mythicalCreatures'><p className='mythicalCreaturesText'>Mythical Creatures</p></Link>
                <Link to='/selected'><p className='shortListedCreaturesText'>Short Listed</p></Link>
                <p className='shortListedCreaturesNumber'>{totalCreatures}</p>
                <Link to='/contracts'><p className='contractCreaturesText'>Contracts</p></Link>
                <Link to='/familiars'><p className='familiarsText'>Familiars</p></Link>
                <div className='creditsBox'>
                    <p className='creditsText'>Credits:</p>
                    <p className='creditsNumber'>{loggedInUser?.credits}</p>
                </div>
                <div className='searchBox'>
                    <input
                        type='text'
                        placeholder='Search for creatures...'
                        className='creatureSearchInput'
                        value={searchSelectedCreature}
                        onChange={(e) => setSearchSelectedCreature(e.target.value)}
                    />
                </div>
            </div>

            <div className='mythicalCreaturesDisplay'>
                {filteredMythicalCreatures.length > 0 ? (
                    filteredMythicalCreatures.map((creature) => (
                        <div className='mythicalCreaturesCard' key={creature._id}>
                            <div className='creatureImageBox'>
                                <img className='creatureImage' src={creature.images.creature} alt={creature.name} />
                            </div>
                            <div className='creatureInfoBox'>
                                <div className='creatureNameBox'>
                                    <p className='creatureName'>{creature.name}</p>
                                </div>
                                <div className='creatureDescriptionBox'>
                                    <p className='creatureDescription'>{creature.description}</p>
                                </div>
                                <div className='creatureBriefBox'>
                                    <div className='creatureHPBox'>
                                        <img className='creatureHPImage' src={creature.images.hp} alt="hp" />
                                        <p className='creatureHPNumber'>{creature.hp}</p>
                                    </div>
                                    <div className='creatureDPBox'>
                                        <img className='creatureDPImage' src={creature.images.dp} alt="dp" />
                                        <p className='creatureDPNumber'>{creature.dp}</p>
                                    </div>
                                    <div className='creatureRarityBox'>
                                        <img className='creatureRarityImage' src={creature.images.rarity} alt="rarity" />
                                        <p className='creatureRarityText'>{creature.rarity}</p>
                                    </div>
                                    <div className='creatureDominantElementBox'>
                                        <img className='creatureDominantElementImage' src={creature.images.element} alt="element" />
                                        <p className='creatureDominantElementText'>{creature.dominantElement}</p>
                                    </div>
                                </div>
                                <div className='creatureCostBox'>
                                    <p className='creatureCostText'>Cost: {creature.cost}</p>
                                </div>
                                <div className='cardButtonBox'>
                                    <button className='moreInformationButton' onClick={() => handleMoreInformation(creature._id)}>
                                        More Info
                                    </button>
                                    <button className='selectCreatureButton' onClick={() => setSelectedCreatureId(creature._id)}>
                                        Select
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='creatureNotFoundText'>Creature Not Found!</p>
                )}
            </div>

            {moreInformationOpen && moreInfoSelectedCreature && (
                <>
                    <div className='extraInfoBackground'></div>
                    <div className='extraInfoContainer'>
                        <div className='extraCreatureImageBox'>
                            <img className='extraCreatureImage' src={moreInfoSelectedCreature.images.creature} alt={moreInfoSelectedCreature.name} />
                        </div>
                        <div className='extraCreatureInfoBox'>
                            <div className='extraCreatureNameBox'>
                                <p className='extraCreatureNameText'>
                                    {moreInfoSelectedCreature.name}
                                </p>
                                </div>

                                <div className='extraCreatureLoreBox'>
                                <p className='extraCreatureLoreText'>
                                    {moreInfoSelectedCreature.lore}
                                </p>
                                </div>
                            <div className='extraCreatureMiscInfoBox'>
                                <div className='extraCreatureHabitatBox'>
                                    <p className='extraCreatureHabitatText'>
                                    <span className='ecpt'>Habitat:</span> {moreInfoSelectedCreature.habitat}
                                </p>
                                </div>

                                <div className='extraCreatureAttackTypeBox'>
                                    <p className='extraCreatureAttackTypeText'>
                                        <span className='ecpt'>Attack Type:</span> {moreInfoSelectedCreature.attackType}
                                    </p>
                                </div>

                                <div className='extraCreaturePersonalityBox'>
                                    <p className='extraCreaturePersonalityText'>
                                        <span className='ecpt'>Personality:</span> {moreInfoSelectedCreature.personality}
                                    </p>
                                </div>

                                <div className='extraCreatureAlliancesBox'>
                                    <p className='extraCreatureAlliancesText'>
                                        <span className='ecpt'>Alliances:</span> {moreInfoSelectedCreature.alliances}
                                    </p>
                                </div>

                                <div className='extraCreatureBattleTacticsBox'>
                                    <p className='extraCreatureBattleTacticsText'>
                                        <span className='ecpt'>Battle Tactics:</span> {moreInfoSelectedCreature.battleTactics}
                                    </p>
                                </div>

                                <div className='extraCreatureLootDropsBox'>
                                    <p className='extraCreatureLootDropsText'>
                                        <span className='ecpt'>Loot Drops:</span> {moreInfoSelectedCreature.lootDrops}
                                    </p>
                                </div>

                                <div className='extraCreatureHiddenAbilitiesBox'>
                                    <p className='extraCreatureHiddenAbilitiesText'>
                                        <span className='ecpt'>Hidden Abilities:</span> {moreInfoSelectedCreature.hiddenAbilities}
                                    </p>
                                </div>
                            </div>
                            <button className='closeButton' onClick={() => {
                                setMoreInformationOpen(false);
                                setMoreInfoSelectedCreature(null);
                            }}>Close</button>
                        </div>
                    </div>
                </>
            )}
            <SideWindow />
        </div>
    );
};

export default MythicalCreatures;
