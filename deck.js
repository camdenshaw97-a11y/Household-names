'use strict';
/*
 * Household Names — the deck.
 * Every card here was written for this game. One card per line:  Name | CATEGORY | points | blurb
 * Points: 1 = everybody knows it, 4 = good luck. FAMILY cards are safe for all ages;
 * AFTER_DARK cards are PG-13 and are only dealt when the host picks the After Dark deck.
 * To add cards, add lines. Keep names unique.
 */

const FAMILY = `
Abraham Lincoln|PEOPLE|1|Sixteenth U.S. president. Very tall, very honest, and devoted to a stovepipe hat he reportedly used as a filing cabinet.
Cleopatra|PEOPLE|2|Last pharaoh of Egypt. Spoke about nine languages and, legend says, once had herself delivered to a meeting rolled up in a rug.
Albert Einstein|PEOPLE|1|Physicist with the most famous hair in science. Worked out that E equals mc squared and disliked wearing socks.
Amelia Earhart|PEOPLE|2|First woman to fly solo across the Atlantic. Vanished over the Pacific in 1937 and has been "almost found" roughly once a decade since.
Napoleon Bonaparte|PEOPLE|2|French emperor who conquered most of Europe. Was about average height for his day, but the short jokes outlasted the empire.
William Shakespeare|PEOPLE|1|English playwright who invented hundreds of words and very rarely let a main character survive the final act.
Leonardo da Vinci|PEOPLE|2|Painter, inventor and world-class procrastinator. Sketched a helicopter four hundred years early and took ages to finish one smile.
Marie Curie|PEOPLE|3|Won Nobel Prizes in two different sciences. Her notebooks are still radioactive and are kept in lead-lined boxes.
George Washington|PEOPLE|1|First U.S. president. Did not have wooden teeth, did cross the Delaware, does live on the one-dollar bill.
Mozart|PEOPLE|2|Composer who was writing music at five and touring Europe at six. Makes everyone else's childhood look unproductive.
Julius Caesar|PEOPLE|2|Roman ruler who ignored a warning about the Ides of March. The salad is not named after him.
Benjamin Franklin|PEOPLE|2|Flew a kite in a thunderstorm, founded a library, and landed on the hundred-dollar bill without ever being president.
Harry Houdini|PEOPLE|3|Escape artist who got out of handcuffs, straitjackets and locked milk cans in front of sold-out crowds.
Neil Armstrong|PEOPLE|2|First person to walk on the Moon. Took one small step and delivered one very well-rehearsed sentence.
Queen Victoria|PEOPLE|3|Ruled Britain for sixty-three years, wore black for forty of them, and was famously not amused.
Vincent van Gogh|PEOPLE|2|Dutch painter of swirling night skies and sunflowers. Sold almost nothing while alive and is now on every dorm room wall.
Paul Revere|PEOPLE|3|Silversmith who took a famous midnight horse ride to warn that the British were coming.
Genghis Khan|PEOPLE|3|Founder of the Mongol Empire, the largest land empire in history. Did it all on horseback and without a map app.
King Tut|PEOPLE|2|Egyptian boy king who took the throne at about nine. Far more famous for his golden tomb than for anything he did while alive.
Joan of Arc|PEOPLE|3|French teenager who led an army in the 1400s after hearing voices that told her to. Later made a saint.
Sacagawea|PEOPLE|4|Shoshone guide and interpreter who crossed the continent with Lewis and Clark while carrying a newborn.
Isaac Newton|PEOPLE|2|Explained gravity, supposedly with help from a falling apple. Also invented calculus, which students still hold against him.
Charles Darwin|PEOPLE|3|Sailed around the world on a ship called the Beagle, stared hard at finches, and came home with the theory of evolution.
Beethoven|PEOPLE|2|Composer who wrote some of his greatest symphonies after losing his hearing. Da-da-da-DUM.
Babe Ruth|PEOPLE|3|Baseball's original slugger. Hit 714 home runs on a training plan that leaned heavily on hot dogs.
Mister Rogers|PEOPLE|2|Gentle TV host who changed into a cardigan and sneakers every episode and asked you to be his neighbor.
Bob Ross|PEOPLE|2|Soft-spoken TV painter with a cloud of curly hair. Believed there were no mistakes, only happy little accidents.
Julia Child|PEOPLE|3|Towering TV chef with an unmistakable voice who taught America French cooking and never apologized for butter.
Elvis Presley|PEOPLE|1|The King of Rock and Roll. Known for swiveling hips, rhinestone jumpsuits and a mansion called Graceland.
Jane Goodall|PEOPLE|3|Scientist who spent decades living among wild chimpanzees and gave them names instead of numbers.
Michael Jordan|PEOPLE|1|Basketball legend who won six championships with Chicago and has a very famous line of sneakers.
Dolly Parton|PEOPLE|2|Country music legend from Tennessee with her own theme park and a program that mails free books to kids.
Taylor Swift|PEOPLE|1|Singer-songwriter known for stadium tours, re-recorded albums and a great many friendship bracelets.
Oprah Winfrey|PEOPLE|1|Talk show host who once gave every single person in her studio audience a car.
Simone Biles|PEOPLE|2|The most decorated gymnast in history. Several moves are named after her because nobody else had done them.
Serena Williams|PEOPLE|2|Tennis great with twenty-three Grand Slam singles titles and one of the fastest serves the sport has seen.
Dwayne "The Rock" Johnson|PEOPLE|1|Wrestler turned movie star with a famously expressive eyebrow.
Weird Al Yankovic|PEOPLE|3|Accordion-playing musician who built a long career out of parody songs, many of them about food.
Tom Hanks|PEOPLE|2|Actor who has played an astronaut, a castaway, a man on a park bench and the voice of a toy cowboy.
Sherlock Holmes|CHARACTERS|1|London's great fictional detective. Lives at 221B Baker Street and notices everything about you, which is exhausting.
Dracula|CHARACTERS|1|Transylvanian count with a cape, a coffin and a strict liquid diet. Does not do mirrors or garlic bread.
Frankenstein's Monster|CHARACTERS|2|Stitched together from spare parts and jolted awake by lightning. Technically, Frankenstein is the doctor.
Robin Hood|CHARACTERS|1|Archer in green tights who robs the rich to give to the poor and lives in Sherwood Forest with his Merry Men.
Cinderella|CHARACTERS|1|Went to a ball in a pumpkin, had a hard curfew of midnight, and lost one very impractical shoe.
Peter Pan|CHARACTERS|1|The boy who refuses to grow up. Flies, fights pirates, and at one point loses his own shadow.
Pinocchio|CHARACTERS|1|Wooden puppet who wants to be a real boy. His nose keeps a running record of his honesty.
The Big Bad Wolf|CHARACTERS|1|Huffs, puffs, and is two for three on houses. Also runs a side business impersonating grandmothers.
Goldilocks|CHARACTERS|1|Broke into a home, ate the porridge, broke a chair, and took a nap. Somehow the bears are the scary ones.
Humpty Dumpty|CHARACTERS|1|An egg who sat on a wall despite being an egg. All the king's horses were, unsurprisingly, no help.
Captain Hook|CHARACTERS|2|Pirate captain with a metal hand and a lifelong grudge against one crocodile that swallowed a clock.
Tarzan|CHARACTERS|2|Raised by apes in the jungle. Gets around by vine and announces himself with a very long yell.
Zorro|CHARACTERS|3|Masked swordsman in black who signs his work by carving one letter with three quick slashes.
Mary Poppins|CHARACTERS|2|Nanny who arrives by umbrella, carries a bottomless bag, and is practically perfect in every way.
Willy Wonka|CHARACTERS|2|Reclusive candy maker in a top hat who gives factory tours with a surprisingly high dropout rate.
The Wicked Witch of the West|CHARACTERS|2|Green, airborne, and after a pair of shoes. Has a severe water allergy.
Ebenezer Scrooge|CHARACTERS|2|Penny-pinching grump who gets a full attitude adjustment from three ghosts in a single night.
Dr. Jekyll and Mr. Hyde|CHARACTERS|3|One polite doctor, one terrible potion, and a very different man after dark.
Moby Dick|CHARACTERS|3|Enormous white whale with a captain's leg on his record and absolutely no interest in being caught.
Rip Van Winkle|CHARACTERS|4|Wandered up a mountain, fell asleep for twenty years, and came back with a long beard and no idea who was in charge.
Paul Bunyan|CHARACTERS|3|Giant lumberjack of American tall tales who travels with a blue ox the size of a barn.
Johnny Appleseed|CHARACTERS|3|Wandered the frontier planting orchards, barefoot, with a cooking pot for a hat.
The Headless Horseman|CHARACTERS|3|Rides through Sleepy Hollow at night looking for his head and settling for a pumpkin.
Rapunzel|CHARACTERS|1|Lives in a tower with no stairs. Her hair is the elevator.
Snow White|CHARACTERS|1|Moved in with seven short roommates and accepted fruit from a stranger against all advice.
Little Red Riding Hood|CHARACTERS|1|Took snacks to grandma, chatted with a wolf on the way, and failed to notice grandma's very big teeth.
The Gingerbread Man|CHARACTERS|2|A cookie who outruns an entire village, then accepts a ride across the river from a fox.
Don Quixote|CHARACTERS|4|Elderly Spanish gentleman who reads too many adventure books, declares himself a knight, and attacks windmills.
Alice in Wonderland|CHARACTERS|1|Followed a rabbit down a hole and spent the day changing sizes and attending a very rude tea party.
The Mad Hatter|CHARACTERS|2|Hosts a tea party that never ends, asks riddles with no answers, and wears a hat with the price tag still on it.
The Cheshire Cat|CHARACTERS|2|Disappears a piece at a time until only the grin is left.
The Tin Man|CHARACTERS|2|Rusts in the rain, carries an axe, and is walking a long yellow road hoping to pick up a heart.
Captain Ahab|CHARACTERS|4|Ship captain with a whalebone leg and a one-item to-do list.
Tom Sawyer|CHARACTERS|3|Mississippi River kid who convinced his friends that whitewashing a fence was a privilege and charged them for it.
The Phantom of the Opera|CHARACTERS|3|Lives under a Paris theater in half a mask, gives voice lessons, and has strong opinions about casting.
Hamlet|CHARACTERS|3|Danish prince who talks to a skull, sees his father's ghost, and takes five acts to make one decision.
Romeo and Juliet|CHARACTERS|1|Teenagers from feuding families who fall in love in about four days. The communication plan lets them down.
Winnie-the-Pooh|CHARACTERS|1|Bear of very little brain and very great appetite for honey. Once got stuck in a doorway after lunch.
Darth Vader|CHARACTERS|1|Heavy breather in a black helmet and cape. Delivers the most famous piece of family news in the movies.
Batman|CHARACTERS|1|Billionaire who fights crime dressed as a bat. No superpowers, lots of gadgets, lives over a cave.
Shrek|CHARACTERS|1|Green ogre who just wants his swamp to himself and ends up with a talking donkey instead.
Mario|CHARACTERS|1|Plumber in red overalls who jumps on turtles, eats mushrooms, and keeps showing up at the wrong castle.
Pikachu|CHARACTERS|1|Small yellow electric creature with red cheeks that can only say its own name.
Yoda|CHARACTERS|1|Small, green, nine hundred years old. Backwards, his sentences he speaks.
Barbie|CHARACTERS|1|Fashion doll who has been an astronaut, a surgeon and a president, and whose feet are permanently shaped for high heels.
SpongeBob SquarePants|CHARACTERS|1|Cheerful sea sponge who flips burgers for a living and lives in a pineapple.
Homer Simpson|CHARACTERS|1|Yellow cartoon dad who works at a nuclear plant, loves donuts, and says "D'oh!"
Elsa|CHARACTERS|1|Queen with ice powers who builds a palace on a mountain and strongly recommends letting things go.
Spider-Man|CHARACTERS|1|Teenager bitten by a radioactive spider. Swings between skyscrapers and still has homework.
Kermit the Frog|CHARACTERS|1|Felt frog who runs a chaotic variety show and finds that it is not easy being green.
Godzilla|CHARACTERS|2|Giant prehistoric sea lizard with atomic breath and no respect for city planning.
King Kong|CHARACTERS|2|Skyscraper-sized gorilla best known for climbing a very tall building in New York and swatting at airplanes.
James Bond|CHARACTERS|2|British spy, code number 007. Introduces himself last name first and is picky about how his drink is mixed.
Indiana Jones|CHARACTERS|2|Archaeology professor with a whip and a fedora who can handle anything except snakes.
Santa Claus|LEGENDS|1|Breaks into every home on Earth in one night, leaves gifts, takes cookies. Keeps detailed lists on your behavior.
The Tooth Fairy|LEGENDS|1|Buys used teeth for cash, at night, with no explanation of what she does with them.
The Easter Bunny|LEGENDS|1|A rabbit who delivers eggs. Nobody has ever cleared up where a rabbit gets eggs.
Bigfoot|LEGENDS|1|Huge, hairy, and lives in the Pacific Northwest woods. Only ever photographed out of focus.
The Loch Ness Monster|LEGENDS|2|Long-necked Scottish lake resident. Goes by Nessie and avoids every camera made after 1934.
Zeus|LEGENDS|2|King of the Greek gods. Throws lightning bolts from a mountaintop and has a complicated family tree.
Medusa|LEGENDS|2|Has snakes for hair, and one look at her turns you to stone. Makes eye contact a real commitment.
King Arthur|LEGENDS|2|Pulled a sword from a stone, became king, and bought a round table so no knight could sit at the head of it.
Hercules|LEGENDS|2|Strongest man in Greek myth. Was assigned twelve impossible chores and finished all of them.
The Grim Reaper|LEGENDS|2|Black hooded robe, long scythe, very punctual. Not somebody you want to see checking a list for your name.
Cupid|LEGENDS|1|Winged baby with a bow and arrow who makes people fall in love without asking them first.
Jack Frost|LEGENDS|2|Winter spirit who paints ice on the windows and is accused of nipping at noses.
Mother Goose|LEGENDS|3|Imaginary author of nearly every nursery rhyme, usually pictured as an old woman riding a large bird.
The Sandman|LEGENDS|3|Sprinkles sand in your eyes to bring you dreams. That is where the crust in the morning is supposed to come from.
Pandora|LEGENDS|3|Was given a box and one instruction, which was not to open it. She opened it.
King Midas|LEGENDS|3|Wished that everything he touched would turn to gold. Lunch became a serious problem.
Icarus|LEGENDS|3|Flew on wings held together with wax, was told not to go near the sun, and went near the sun.
Poseidon|LEGENDS|2|Greek god of the sea. Carries a trident and takes shipwrecks personally.
The Minotaur|LEGENDS|3|Half man, half bull, and living at the center of a maze that was built specifically to keep him there.
Thor|LEGENDS|2|Norse god of thunder. Carries a hammer that only he can lift and that always comes back to him.
A Genie|LEGENDS|1|Lives in a lamp, grants three wishes, and has heard every loophole you are about to try.
A Leprechaun|LEGENDS|1|Tiny Irish shoemaker in green who hides a pot of gold at the end of the rainbow.
A Unicorn|LEGENDS|1|A horse with one spiral horn and an outstanding publicist.
A Dragon|LEGENDS|1|Giant flying lizard that breathes fire and sleeps on a pile of treasure it never spends.
A Werewolf|LEGENDS|2|Ordinary person for most of the month. The full moon is where it gets hairy.
A Mermaid|LEGENDS|1|Half person, half fish. Sits on rocks, sings to sailors, and has never needed shoes.
A Yeti|LEGENDS|2|The Abominable Snowman. Bigfoot's cousin who took the job in the Himalayas.
A Mummy|LEGENDS|1|Ancient Egyptian wrapped head to toe in bandages. Walks slowly with both arms straight out.
A Zombie|LEGENDS|1|Back from the dead, shuffling, groaning, and single-minded about brains.
A Ghost|LEGENDS|1|See-through, says "boo", and is traditionally shown as a bedsheet with two eye holes.
The Kraken|LEGENDS|3|Legendary sea monster the size of an island. Wraps its tentacles around ships and pulls them under.
The Chupacabra|LEGENDS|4|Spiny creature of Latin American legend blamed for bothering goats at night. Its name means "goat sucker."
A Narwhal|ANIMALS|2|Arctic whale with one long spiral tusk. The closest thing the ocean has to a unicorn.
A Sloth|ANIMALS|1|Hangs upside down, moves about as fast as a loading bar, and climbs down once a week to use the bathroom.
A Honey Badger|ANIMALS|3|Small, fearless, and willing to pick fights with lions and cobras. Famous for not caring.
An Axolotl|ANIMALS|4|Pink Mexican salamander with feathery gills that looks like it is always smiling and can regrow its own legs.
A Platypus|ANIMALS|2|Has a duck's bill, a beaver's tail, lays eggs, and is venomous. Looks assembled from leftover parts.
A Chihuahua|ANIMALS|1|Five pounds of dog with the confidence of a much larger animal. Shivers when it is seventy-five degrees.
A Mosquito|ANIMALS|1|Tiny, whining, and somehow always able to find the one ankle that is outside the blanket.
A T. rex|ANIMALS|1|The king of the dinosaurs. Enormous teeth, tiny arms, and no way of making a bed.
A Flamingo|ANIMALS|1|Tall pink bird that stands on one leg. It is pink because of all the shrimp.
A Raccoon|ANIMALS|1|Masked bandit of the trash cans. Washes its food with little hands before eating your garbage.
A Goldfish|ANIMALS|1|Won at the fair, named in the car, and blamed for having a three-second memory.
An Octopus|ANIMALS|2|Eight arms, three hearts, no bones. Can open a jar and squeeze through a gap the size of a coin.
A Peacock|ANIMALS|1|Bird with a tail like a jeweled fan who is very aware of how good it looks.
A Porcupine|ANIMALS|2|Walking pincushion covered in thousands of quills. Hugging is done at your own risk.
A Woodpecker|ANIMALS|2|Bird that hammers its face into trees thousands of times a day and never seems to get a headache.
A Hermit Crab|ANIMALS|2|Lives in a borrowed shell and goes house hunting every time it grows.
A Possum Playing Dead|ANIMALS|2|When scared, it tips over, sticks out its tongue and commits completely to the performance.
A Sea Otter|ANIMALS|2|Floats on its back, cracks shellfish on its stomach, and holds hands while sleeping so nobody drifts away.
A Rooster|ANIMALS|1|Farmyard alarm clock with no snooze button and no sense of what time dawn actually is.
A Penguin|ANIMALS|1|Bird in a tuxedo that cannot fly, waddles on land, and turns into a torpedo underwater.
A Giraffe|ANIMALS|1|Tallest animal on Earth. Has a neck like a crane and a long purple tongue.
A Skunk|ANIMALS|1|Black and white, and carrying a defense system you will smell for a week.
A Firefly|ANIMALS|2|Summer-evening beetle with a rear end that lights up. Often spends a night in a jar.
A Chameleon|ANIMALS|2|Lizard that changes color, moves each eye separately, and has a tongue longer than its body.
A Pufferfish|ANIMALS|2|When it is nervous, it inflates into a spiky balloon.
A Dung Beetle|ANIMALS|3|Insect that spends its whole life rolling a ball of poop, and steers by the stars to do it.
A Kangaroo|ANIMALS|1|Australian hopper with built-in storage and a strong kick.
A Golden Retriever|ANIMALS|1|Loves you, loves the mail carrier, loves the burglar. Will bring any of you a slobbery tennis ball.
A Cat Knocking a Glass Off the Table|ANIMALS|2|Slowly, deliberately, and without breaking eye contact.
A Seagull Stealing Your Fries|ANIMALS|2|The beach pickpocket. Works fast, shows no remorse, and brings friends.
A Goose With an Attitude|ANIMALS|2|Hisses, chases, and believes the entire park belongs to it.
A Squirrel That Forgot Where It Buried Everything|ANIMALS|3|Hid thousands of nuts last fall. Is now responsible for planting most of the forest by accident.
The Bermuda Triangle|PLACES|2|Patch of the Atlantic where ships and planes are said to vanish. So does your luggage, but that is just the airline.
Atlantis|PLACES|2|Legendary city that sank beneath the sea in a single day. Still not on any map.
The Leaning Tower of Pisa|PLACES|1|Italian bell tower that has been falling over very slowly for eight hundred years. Tourists pretend to hold it up.
The North Pole|PLACES|1|Top of the world. Home to a toy workshop, an elf workforce and no property tax.
Area 51|PLACES|2|Top-secret base in the Nevada desert. Officially there are no aliens there. Officially.
Stonehenge|PLACES|2|Ring of giant rocks in an English field. Nobody is sure who stacked them or why.
Mount Rushmore|PLACES|1|South Dakota mountain with four presidents' faces carved into it, each about sixty feet tall.
The Great Wall of China|PLACES|1|Thousands of miles of wall, built over centuries to keep invaders out. A very long walk.
The DMV|PLACES|2|Where you take a number, wait two hours, and have the worst photo of your life taken on purpose.
A Bouncy Castle|PLACES|1|Inflatable palace at a birthday party. Shoes off, socks on, someone always cries.
The Kids' Table|PLACES|2|Folding table at holiday dinner with the mismatched chairs. Graduation can take decades.
A Haunted House|PLACES|1|Creaky stairs, cold spots, a door that closes by itself. The price was suspiciously low.
The Eiffel Tower|PLACES|1|Iron tower in Paris that was supposed to be temporary. Sold in miniature on every street corner nearby.
Niagara Falls|PLACES|2|Giant waterfall on the U.S.-Canada border. People wear ponchos to look at it and have gone over it in barrels.
The Grand Canyon|PLACES|1|Mile-deep hole in Arizona that a river spent millions of years carving. Dads are required to say "that's a big hole."
A Porta-Potty|PLACES|2|Plastic bathroom booth at the fair. You hold your breath and touch as little as possible.
Las Vegas|PLACES|1|Desert city of neon, casinos and all-you-can-eat buffets, where what happens there is supposed to stay there.
A Corn Maze|PLACES|2|A fall tradition of paying money to get lost in a farmer's field.
The Lost and Found|PLACES|2|A box of single gloves, water bottles and one sweatshirt nobody will ever claim.
An Escape Room|PLACES|2|You pay to be locked in a room with your family and a combination lock, and learn who panics.
Easter Island|PLACES|3|Remote Pacific island known for its hundreds of giant stone heads, which also have bodies underground.
The Statue of Liberty|PLACES|1|Giant green lady in New York Harbor holding a torch. A gift from France, shipped in pieces.
Old Faithful|PLACES|3|Yellowstone geyser that shoots boiling water into the air on a schedule you can set a watch by.
A Drive-Thru|PLACES|1|Where you shout your dinner order at a speaker box and hope for the best at the second window.
The Middle Seat|PLACES|2|Airplane seat with no window, no aisle, and a silent fight for both armrests.
The Titanic|PLACES|1|"Unsinkable" ocean liner that met an iceberg on its very first trip in 1912.
The Bottom of a Backpack|PLACES|3|Home to a squashed banana, a permission slip from March, and crumbs of unknown origin.
A Waiting Room|PLACES|2|Old magazines, a fish tank, and a clock that seems to be running backwards.
Grandma's House|PLACES|1|There is a candy dish, the thermostat is set to eighty, and you will be asked if you have eaten.
The Garage|PLACES|2|Designed for a car. Actually contains exercise equipment, paint cans and boxes labeled "misc."
A Treehouse|PLACES|1|Clubhouse in the branches with a rope ladder and a hand-painted sign about who is not allowed in.
The Pyramids of Giza|PLACES|2|Enormous stone tombs in the Egyptian desert, built forty-five centuries ago without a single crane.
A Piñata|THINGS|1|Paper animal full of candy that blindfolded children are handed a stick and told to hit.
A Lava Lamp|THINGS|2|Lamp full of slow glowing blobs that drift up and down. Gives off almost no useful light.
A Whoopee Cushion|THINGS|1|Rubber bag you hide on a chair. Comedy that has not needed an update in a hundred years.
A Slinky|THINGS|1|Metal spring that walks down stairs. Works twice, then tangles forever.
The Junk Drawer|THINGS|2|Kitchen drawer of dead batteries, takeout menus, one mystery key and every rubber band you have ever owned.
A Fruitcake|THINGS|2|Dense holiday brick full of neon fruit. The same one may have been passed around since 1987.
A Selfie Stick|THINGS|2|A pole for taking pictures of yourself from slightly farther away.
A Leaf Blower|THINGS|2|Very loud machine for moving leaves into the neighbor's yard, usually at seven on a Saturday morning.
Bubble Wrap|THINGS|1|Packing material that is more fun than whatever it came wrapped around.
A Fanny Pack|THINGS|1|A purse you wear like a belt. Preferred by tourists, dads and people who are right about how handy it is.
A Robot Vacuum|THINGS|2|Disc that wanders the house cleaning floors until it gets stuck under the couch and calls for help.
A Crystal Ball|THINGS|2|Glass globe a fortune teller waves her hands over to see your future, which always involves a tall stranger.
A Pogo Stick|THINGS|2|A pole with a spring on the bottom. Transportation, if you only need to go up and down.
A Jack-in-the-Box|THINGS|2|You turn the crank, a tune plays, and a clown springs out. Somehow sold as a toy for babies.
Glitter|THINGS|1|Tiny sparkles used once in a craft project and found in the carpet for the rest of your life.
Duct Tape|THINGS|1|Silver tape that fixes everything. If it cannot be fixed with this, you are not using enough.
A Participation Trophy|THINGS|2|Award for showing up. Small, gold-colored and plastic.
A Rubber Chicken|THINGS|2|The floppy, featherless mascot of bad comedy.
A Snow Globe|THINGS|1|A tiny village in a glass ball. Shake it for a blizzard.
A Yo-Yo|THINGS|1|A toy on a string that goes down and, on a good day, comes back up.
A Kazoo|THINGS|2|Instrument you hum into. It makes every song sound like an angry bee.
A Disco Ball|THINGS|1|Mirrored sphere that hangs from the ceiling and throws spinning dots of light around the dance floor.
A Lawn Flamingo|THINGS|2|Pink plastic bird on metal legs that stands in the front yard as a decorating choice.
A Boomerang|THINGS|1|Curved stick you throw that is supposed to come back. Ask whoever is standing behind you.
The TV Remote|THINGS|1|Always missing, usually between the couch cushions, and controlled by whoever found it.
A Unicycle|THINGS|2|Half of a bicycle. Popular with clowns and with that one kid at the talent show.
A Hula Hoop|THINGS|1|Plastic ring you keep spinning around your waist with your hips, for as long as you can.
A Tuba|THINGS|2|The largest and lowest brass instrument. The player wears it more than holds it.
A Trampoline|THINGS|1|Backyard bouncing platform and the origin of at least one family emergency room story.
A Sock With No Match|THINGS|2|Went into the dryer as half of a pair. Came out alone.
A Metal Detector|THINGS|2|Beeping wand for sweeping the beach in search of treasure. Mostly finds bottle caps.
A Mood Ring|THINGS|3|Jewelry that claims to read your emotions by changing color. It is reading how warm your finger is.
A Typewriter|THINGS|2|A keyboard that prints as you go, dings at the end of the line, and has no delete key.
A Fax Machine|THINGS|3|Screeching office machine that sends a piece of paper through the phone line.
A Garden Gnome|THINGS|2|Small bearded statue in a pointy red hat who guards the flower bed.
Bagpipes|THINGS|2|Scottish instrument that is a bag you squeeze under your arm. It has one volume, and it is all of it.
A Time Capsule|THINGS|3|A box of ordinary things you bury so that people in the future can be confused by them.
A Pet Rock|THINGS|3|A stone sold in a box as a pet. Needs no food, no walks and no vet. Millions were bought.
A Cuckoo Clock|THINGS|2|Wall clock where a tiny wooden bird pops out of a door every hour to yell the time.
A Hot Air Balloon|THINGS|1|A wicker basket hanging under a giant bag of hot air. Steering is mostly a suggestion.
The Last Slice of Pizza|THINGS|2|Everyone wants it. Nobody will take it. It sits in the box while the whole room stays polite.
Pineapple on Pizza|THINGS|2|The topping that has ended friendships.
Leftovers|THINGS|1|Last night's dinner in a container that does not have a matching lid.
A Bidet|THINGS|3|Bathroom fixture that washes you with a jet of water after you go. Usually a surprise the first time.
A Kite|THINGS|1|Paper and string that flies beautifully for the kid next to you and nosedives for you.
A Magic Wand|THINGS|1|Black stick with white tips. Tap the hat with it, say the words, and hope the rabbit cooperates.
A Scratch-and-Sniff Sticker|THINGS|3|A sticker you rub with a fingernail to release a smell that is described as grape.
A Stapler Stuck in Gelatin|THINGS|4|A classic office prank. Somebody spent a lot of time on it and regrets nothing.
The Ice Cream Truck|THINGS|1|You hear the jingle from three streets away and immediately start begging for money.
A Bunk Bed|THINGS|1|Two beds stacked up. Whoever is older gets the top.
A Dad Joke|MOMENTS|1|So bad that it is good. The correct response is a groan, which only makes him stronger.
The Floor Is Lava|MOMENTS|1|Someone shouts it and everybody has to climb onto the furniture immediately.
Daylight Saving Time|MOMENTS|2|Twice a year everyone changes their clocks and spends a week confused. The microwave never gets updated.
The Family Group Chat|MOMENTS|2|Forty unread messages, most of them your aunt replying to a photo with a thumbs up.
Waving Back at Someone Who Was Waving at the Person Behind You|MOMENTS|3|You commit to the wave, realize the mistake, and turn it into fixing your hair.
Replying All|MOMENTS|3|Sending your private comment about an email to every person who received the email.
The Five-Second Rule|MOMENTS|1|Scientific law stating that food dropped on the floor is still fine if you are quick about it.
A Pocket Dial|MOMENTS|2|Your phone calls someone on its own from inside your pants and leaves a four-minute voicemail of walking sounds.
An Awkward High Five|MOMENTS|2|One of you went for a high five and the other went for a fist bump. Now you are holding their fist.
A Food Coma|MOMENTS|1|What happens on the couch after the third plate.
Assembling Furniture Without the Instructions|MOMENTS|3|Three hours, one tiny wrench, and five leftover screws that were probably not important.
Forgetting Why You Walked Into the Room|MOMENTS|2|You came in here for something. You stand still and hope it comes back to you.
The Hiccups|MOMENTS|1|They arrive for no reason, and everybody around you has a cure that does not work.
A Wedgie|MOMENTS|1|When your underwear goes somewhere it should not, with or without help from an older sibling.
A Belly Flop|MOMENTS|1|A dive that went flat. Everyone at the pool hears it.
Déjà Vu|MOMENTS|2|The odd feeling that this exact moment has already happened. The odd feeling that this exact moment has already happened.
Brain Freeze|MOMENTS|1|The headache you get from eating something cold too fast, and continue eating anyway.
"Are We There Yet?"|MOMENTS|1|Question asked from the back seat every ten minutes starting at the end of the driveway.
Parallel Parking|MOMENTS|2|Backing into a tight space on the street while a line of cars and several pedestrians watch you do it.
A Surprise Party|MOMENTS|1|Everyone hides in the dark and then jumps out yelling at the guest of honor.
A Sugar Rush|MOMENTS|1|What follows the birthday cake: twenty minutes of sprinting in circles, then a crash.
Bedhead|MOMENTS|1|The hairstyle your pillow chose for you.
A Staring Contest|MOMENTS|1|Two people, no blinking. The loser is whoever's eyes start watering first.
The Silent Treatment|MOMENTS|2|Loudly not speaking to someone so that they know you are not speaking to them.
A Paper Cut|MOMENTS|1|The smallest injury there is and somehow the most painful.
Your Foot Falling Asleep|MOMENTS|2|You sat on it too long. Now it is static, and standing up is going to be an event.
Losing a Sneeze|MOMENTS|3|It was right there. You made the face and everything. Then it left.
A Cannonball|MOMENTS|1|Running jump into the pool with your knees tucked, with the goal of soaking everyone on the deck.
The Chicken Dance|MOMENTS|2|Wedding reception tradition involving beak hands, flapping elbows and a wiggle.
Musical Chairs|MOMENTS|1|Party game with one less seat than there are people. Gets physical when the music stops.
A Photobomb|MOMENTS|1|Jumping into the background of somebody else's picture at the last second.
Autocorrect|MOMENTS|2|Your phone confidently changing what you typed into something you ducking did not mean.
One Percent Battery|MOMENTS|2|Your phone is about to die and you are nowhere near a charger. Time to find out who you really are.
Stage Fright|MOMENTS|2|Sweaty hands, shaky knees, and a mind that has gone completely blank in front of an audience.
Jet Lag|MOMENTS|2|Your body is in one time zone and your brain is still in another. Wide awake at three in the morning.
The Stadium Wave|MOMENTS|2|Thousands of strangers taking turns standing up with their arms in the air, one section at a time.
Karaoke|MOMENTS|1|Singing a song you only half know into a microphone while the words scroll by on a screen.
Hitting Snooze|MOMENTS|1|Nine more minutes. Then nine more. Then you are late.
A Sunburn|MOMENTS|1|What you get when you said you did not need sunscreen. Comes with a pattern in the shape of your shirt.
A Mic Drop|MOMENTS|2|Finishing your point and letting go of the microphone because nothing more needs saying.
Spoilers|MOMENTS|2|Telling someone how it ends before they have seen it. A crime in most friend groups.
Calling Shotgun|MOMENTS|1|Yelling one word to claim the front passenger seat. Must be done within sight of the car.
A Thumb War|MOMENTS|1|One, two, three, four. A wrestling match that fits in two hands.
Grandma's Secret Recipe|MOMENTS|2|She will take it with her. It turns out to be on the back of the box.
The Family Road Trip|MOMENTS|1|Nine hours in the car, one bathroom stop that Dad agreed to, and a fight about the invisible line on the back seat.
Thanksgiving Leftovers|MOMENTS|1|Turkey sandwiches for four straight days.
Stepping on a Toy Brick|MOMENTS|1|Barefoot, in the dark, on the way to the bathroom. The most pain a parent can feel.
An Alien Abduction|MOMENTS|2|A bright beam of light, a flying saucer, and a story nobody at work believes.
Tripping Up the Stairs|MOMENTS|2|Falling in the wrong direction and then looking back at the step like it did something.
Singing in the Shower|MOMENTS|1|A sold-out concert for an audience of shampoo bottles. The acoustics are excellent.
A Pillow Fight|MOMENTS|1|Sleepover combat. All fun until someone takes one to the face at full swing.
The Awkward Silence in an Elevator|MOMENTS|2|Everyone faces the door and studies the floor numbers very carefully.
A Double Rainbow|MOMENTS|2|Two arcs across the sky at once. Everyone runs outside and takes a bad photo of it.
Pulling a Push Door|MOMENTS|2|The sign says what to do. You do the other thing, firmly, in front of people.
Losing a Tooth|MOMENTS|1|Wiggly for a week, then out in an apple. Worth a little money by morning.
The Wrong Name on Your Coffee Cup|MOMENTS|3|You said it clearly. You even spelled it. This is not your name.
A Snow Day|MOMENTS|1|School is cancelled. The best phone call a kid can get.
A Backseat Driver|FOLKS|1|Does not have the wheel, does have opinions about your speed, your lane and that stop sign back there.
A Sore Loser|FOLKS|1|Flips the board, blames the dice, and demands a rematch.
The Person Who Claps When the Plane Lands|FOLKS|3|Believes the pilot can hear it.
A Mall Santa|FOLKS|2|Seasonal employee in a fake beard who listens to wish lists while a line of crying toddlers waits.
A Sleepwalker|FOLKS|2|Up and about with their eyes closed. Found in the kitchen at night with no memory of the sandwich.
A Mime|FOLKS|1|Silent performer in white face paint and stripes who is forever trapped in a box nobody else can see.
A Ventriloquist|FOLKS|2|Talks without moving their lips so that a puppet on their knee can be rude for them.
A Substitute Teacher|FOLKS|2|Is not going to get through the lesson plan. The class decides to watch a movie.
A Lifeguard|FOLKS|1|Sits in a tall chair with a whistle and tells you to walk.
A Tightrope Walker|FOLKS|2|Crosses a thin wire high above the crowd holding a long pole, without looking down.
A Ninja|FOLKS|1|Dressed in black, silent, and already behind you.
A Pirate|FOLKS|1|Eye patch, parrot, wooden leg. Says "Arrr" and buries money instead of using a bank.
A Sumo Wrestler|FOLKS|2|Very large Japanese athlete in a very small outfit who tries to push the other one out of a ring.
An Astronaut|FOLKS|1|Wears a bulky white suit, floats at work, and eats dinner out of a tube.
A Cowboy|FOLKS|1|Boots, spurs, big hat, a lasso and a horse. Says "howdy" and walks like he just got off the horse.
A Mad Scientist|FOLKS|2|Wild hair, lab coat, bubbling beakers, and a laugh that goes on a little too long.
A Fortune Teller|FOLKS|2|Reads your palm, turns over some cards, and tells you a journey is coming.
A Knight in Shining Armor|FOLKS|1|Rides in on a horse wearing a full metal suit to rescue someone who may or may not have asked.
A Magician's Assistant|FOLKS|3|Climbs in the box, gets sawed in half every night, and smiles the whole time.
A Lunch Lady|FOLKS|2|Hairnet, ladle, and complete control over the size of your scoop.
A Mall Cop|FOLKS|2|Patrols the food court on a two-wheeled scooter and takes it seriously.
The Neighbor Who Never Returns Your Tools|FOLKS|3|Borrowed the ladder in 2019. Waves at you from underneath it.
A Toddler With a Permanent Marker|FOLKS|2|It has been quiet for three minutes. The wall is now a mural.
The Uncle Who Falls Asleep After Dinner|FOLKS|2|In the recliner, mouth open, game on. Says "I was watching that" if you touch the remote.
A Soccer Mom|FOLKS|2|Folding chair, orange slices, minivan. Knows the snack schedule for the whole season.
A Hall Monitor|FOLKS|2|Classmate with a sash and a little bit of power who would like to see your pass.
A Clown|FOLKS|1|Red nose, giant shoes, a horn. Arrives with nineteen coworkers in one tiny car.
A Barbershop Quartet|FOLKS|3|Four singers in striped vests and straw hats harmonizing without any instruments.
A Human Cannonball|FOLKS|3|Circus performer who is fired out of a giant gun into a net on the other side of the tent.
The Kid Who Reminds the Teacher About Homework|FOLKS|3|One minute before the bell. Hand straight up. No regard for anyone else in the room.
A Tourist|FOLKS|1|Camera around the neck, map held upside down, standing still in the middle of the sidewalk.
A Wedding DJ|FOLKS|2|Plays the same twelve songs every Saturday and keeps asking all the single ladies to come to the floor.
`;

const AFTER_DARK = `
The Walk of Shame|MOMENTS|2|Heading home at sunrise in last night's outfit, carrying your shoes, past people going to brunch.
A Hangover|MOMENTS|1|The bill for last night, payable in headache. Sunlight and loud chewing are now your enemies.
Beer Goggles|MOMENTS|2|The mysterious effect by which everyone at the bar gets better looking after the third round.
A Regrettable Tattoo|THINGS|2|It was two in the morning, it was a great idea, and it is spelled wrong.
Skinny-Dipping|MOMENTS|2|Swimming at night without the swimsuit. Someone always hides the clothes.
A Wardrobe Malfunction|MOMENTS|2|When your outfit quits in public and shows the crowd more than you planned.
The Drunk Uncle at the Wedding|FOLKS|2|Tie around his head by nine o'clock. Owns the dance floor and has a toast nobody asked for.
Texting Your Ex at 2 A.M.|MOMENTS|2|"Hey, you up?" A message that has never once been a good idea.
A Hickey|THINGS|2|A neck bruise with a backstory. The reason for the scarf in July.
A Bachelor Party|MOMENTS|2|One last weekend with the guys, matching shirts, and a group promise that nobody talks about it.
Friends With Benefits|MOMENTS|3|An arrangement with clear rules and no feelings, until somebody catches feelings.
A Dad Bod|THINGS|2|The physique of a man who used to play sports and now mostly finishes the kids' fries.
A Lower-Back Tattoo|THINGS|3|A butterfly or some tribal swirls, placed just above the waistband around 2003.
Strip Poker|MOMENTS|2|Card game where the stakes are your clothes. Wear layers.
A Wingman|FOLKS|2|The friend who talks you up at the bar and keeps your crush's friend busy.
A Beer Belly|THINGS|1|A stomach built one pint at a time. Makes a handy shelf.
Jello Shots|THINGS|2|Dessert with a secret. Served in tiny plastic cups at parties that end badly.
A Keg Stand|MOMENTS|3|Drinking from the tap while your friends hold you upside down by the ankles and count.
Karaoke After Three Margaritas|MOMENTS|2|Suddenly you know every word and you are certain you sound amazing.
Happy Hour|MOMENTS|1|The time right after work when drinks are half price and nobody mentions the meeting.
The Designated Driver|FOLKS|1|The one sober person in the group. Drinks soda all night and remembers everything you said.
A Bar Tab You Don't Remember Opening|THINGS|3|The receipt you find in your pocket the next morning. Apparently you bought a round for the whole room.
An Elvis Wedding in Vegas|MOMENTS|2|Married at midnight in a drive-through chapel by a man in a white jumpsuit and sideburns.
A Mullet|THINGS|1|Business in the front, party in the back. A haircut with two opinions.
A Confident Grandpa in a Tiny Swimsuit|FOLKS|2|He has earned it, he is comfortable, and the rest of the beach will just have to cope.
A Nude Beach|PLACES|2|No tan lines, plenty of sunscreen, and firm eye contact at all times.
A Fart in an Elevator|MOMENTS|1|Six people, one small box, eleven floors to go. Everyone knows and nobody will say.
Morning Breath|THINGS|1|The dragon that moves into your mouth overnight.
A Bikini Wax|MOMENTS|3|You pay a stranger to rip the hair out at high speed and then you thank them.
Going Commando|MOMENTS|3|Leaving the house without underwear, either on purpose or because it is laundry day.
Mooning Someone|MOMENTS|2|Dropping your pants to show your rear end out a car window as a form of communication.
The Office Holiday Party|MOMENTS|2|Free drinks with your coworkers. On Monday, nobody can look at the person from accounting.
A Prenup|THINGS|3|Paperwork you sign before the wedding about who gets what if it does not work out. Very romantic.
A Midlife-Crisis Convertible|THINGS|2|Red, two seats, bought the week of a fiftieth birthday.
A Sugar Daddy|FOLKS|3|An older gentleman whose main charm is that he pays for everything.
The Ex Who Still Watches Your Stories|FOLKS|3|You broke up two years ago. They have never missed an upload.
Ghosting|MOMENTS|2|Ending a relationship by simply never answering again.
Catfishing|MOMENTS|3|Pretending to be somebody else online. The photos are of a model from another country.
A Dating App Bio|THINGS|3|Loves travel, tacos and "adventures." Holding a fish in the first photo.
A Bad First Date|MOMENTS|2|He talked about his ex for an hour and then asked to split the check to the penny.
Third-Wheeling|MOMENTS|2|Tagging along with a couple and holding the camera while they kiss.
The Friend Zone|PLACES|2|Where you end up after hearing "you're like a brother to me."
A Love Triangle|MOMENTS|2|Three people, two options, one very bad group vacation.
A Shotgun Wedding|MOMENTS|3|A ceremony planned in a hurry, usually because a baby is going to beat the invitations.
A Divorce Party|MOMENTS|3|Cake, champagne, and a ring nobody is wearing anymore.
Meeting the In-Laws|MOMENTS|2|A dinner where you are being interviewed and you do not know which fork to use.
Beer Pong|MOMENTS|2|Table tennis without paddles, played with plastic cups. The loser drinks.
A Hip Flask|THINGS|3|A small metal bottle that fits in a jacket pocket and gets you through the school recital.
A Bloody Mary|THINGS|2|Tomato juice cocktail that counts as breakfast because there is celery in it.
Tequila|THINGS|1|Lick the salt, take the shot, bite the lime, text someone you should not.
Box Wine|THINGS|2|Wine with a spigot. Classy enough for a Tuesday and it fits in the fridge door.
A Hot Tub Full of Strangers|PLACES|3|The hotel jacuzzi. Warm, bubbling, and there is a man in there who wants to chat.
A Bachelorette Party Sash|THINGS|3|Pink satin that announces the bride to the whole bar. Usually comes with a plastic tiara.
A Poker Face|THINGS|2|An expression that gives away nothing, even when you are holding garbage.
Losing It All on Red|MOMENTS|3|One spin of the roulette wheel, one color, the whole vacation budget.
A Thong|THINGS|2|Underwear engineered to be a permanent wedgie.
Shapewear|THINGS|3|Stretchy underwear that squeezes everything in. Breathing is extra.
A Push-Up Bra|THINGS|3|Engineering and padding working together to create an optical illusion.
A Fake ID|THINGS|2|Says you are twenty-six and from a state you have never been to. The photo is clearly your cousin.
Liquid Courage|THINGS|3|The drink you have right before you finally go talk to them.
The Kiss Cam|MOMENTS|2|The stadium big screen finds you and your date, or worse, you and your sister.
Spin the Bottle|MOMENTS|2|Middle school party game where a soda bottle decides who you have to kiss.
Seven Minutes in Heaven|MOMENTS|3|Two teenagers are sent into a dark closet while everyone outside watches the clock.
Truth or Dare|MOMENTS|1|Sleepover game where you either admit your crush or eat something off the floor.
A Conga Line at 2 A.M.|MOMENTS|3|Hands on the hips of the person in front, kicking every fourth beat, going nowhere in particular.
Swearing in Front of Grandma|MOMENTS|2|It just slipped out at dinner. The whole table has gone quiet.
A Swear Jar|THINGS|2|You pay a dollar for every bad word. Dad is funding the family vacation by himself.
The Middle Finger|THINGS|1|The one-finger salute. Popular in traffic.
A Music Festival Porta-Potty on Day Three|PLACES|3|You have been holding it since yesterday. You open the door anyway.
Gas Station Sushi|THINGS|2|Raw fish from the place where you also buy windshield fluid. A bold lunch.
A Colonoscopy|MOMENTS|3|A medical checkup from the other end. The preparation the night before is the hard part.
A Vasectomy|MOMENTS|4|A quick snip for men who are done having kids, followed by a weekend on the couch with frozen peas.
Botox|THINGS|2|Injections that smooth out wrinkles and leave you looking mildly surprised at everything.
A Toupee|THINGS|2|A small rug for the top of a man's head. Fools nobody, especially in the wind.
A Spray Tan|THINGS|2|A summer glow from a nozzle. Results vary from sun-kissed to traffic cone.
The Little Blue Pill|THINGS|3|Medication for gentlemen. The commercials warn you to call a doctor after four hours.
A Honeymoon Suite|PLACES|3|Heart-shaped tub, rose petals on the bed, and two towels folded into swans.
A Mistletoe Ambush|MOMENTS|2|Somebody hung it in the doorway and has been waiting next to it all night.
The Bouncer|FOLKS|2|Very large man on a stool by the door who decides whether you are on the list.
Last Call|MOMENTS|2|The lights come up, the music stops, and you can finally see everyone you have been talking to.
A Tailgate Party|MOMENTS|2|A cookout in a stadium parking lot that starts five hours before the game.
Hair of the Dog|THINGS|4|Curing this morning's hangover with another drink. Doctors do not recommend it.
Cold Pizza for Breakfast|THINGS|1|Straight from the box, standing at the counter. The breakfast of champions and the recently partied.
A Streaker at the Ball Game|FOLKS|2|Runs across the field wearing only sneakers while security tries to catch up.
A Bad Kisser|FOLKS|3|Too much tongue, not enough warning. Like being licked by a friendly dog.
A Flirty Text Sent to the Family Group Chat|MOMENTS|3|It was meant for one person. Your grandmother has replied with a question mark.
A Man Cave|PLACES|2|Basement room with a huge TV, a neon sign and a recliner, where one man goes to be left alone.
Getting Cut Off by the Bartender|MOMENTS|3|"I think you've had enough, buddy." You disagree, loudly, which proves the point.
A Beer Run|MOMENTS|2|The emergency trip to the store when the party runs dry. Somebody always volunteers the new guy.
The Morning After a Chili Cook-Off|MOMENTS|3|You tried all fourteen entries. You have made a terrible mistake.
`;

const CATEGORIES = require('./rules').CATEGORIES;

function parse(block, rating, startId) {
  const out = [];
  for (const line of block.split('\n')) {
    if (!line.trim()) continue;
    const parts = line.split('|');
    if (parts.length !== 4) throw new Error('Bad card line: ' + line);
    const [name, cat, pts, blurb] = parts.map(s => s.trim());
    if (!CATEGORIES[cat]) throw new Error('Unknown category on card: ' + line);
    const points = Number(pts);
    if (!(points >= 1 && points <= 4)) throw new Error('Bad points on card: ' + line);
    out.push({ id: startId + out.length, name, cat, points, blurb, rating });
  }
  return out;
}

const family = parse(FAMILY, 'family', 1);
const afterDark = parse(AFTER_DARK, 'dark', 1001);
const ALL = family.concat(afterDark);
const BY_ID = new Map(ALL.map(c => [c.id, c]));
{
  const seen = new Set();
  for (const c of ALL) { const k = c.name.toLowerCase(); if (seen.has(k)) throw new Error('Duplicate card: ' + c.name); seen.add(k); }
}

module.exports = { ALL, BY_ID, CATEGORIES, family, afterDark };
