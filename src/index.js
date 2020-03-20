import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form'
import './index.css';

function App() {
    const [pokedex, setPokedex] = useState([]);
    const [wildPokemon, setWildPokemon] = useState({});
    const [pokemon, setPokemon] = useState('bulbasaur');
    const {register, handleSubmit, errors} = useForm();



    useEffect(() => {
        fetchPokemon();
    }, []);


    const onSubmit = data => {
        setPokemon(data.pokemon.toLowerCase());
        fetchPokemon();
    };



    const fetchPokemon = () => {
        axios
            .get('https://pokeapi.co/api/v2/pokemon/' + pokemon)
            .then(response => {
                setWildPokemon(response.data);
            })
            .catch(function (error) {
                if (error.response) {
                    // Request made and server responded
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }

            });

    };

    const catchPokemon = (pokemon) => {
        setPokedex(state => {
            const monExists = (state.filter(p => pokemon.id == p.id).length > 0);

            if (!monExists) {
                state = [...state, pokemon]
                state.sort(function (a, b) {
                    return a.id - b.id
                })
            }
            return state;
        });
        fetchPokemon();
    };

    const releasePokemon = id => {
        setPokedex(state => state.filter(p => p.id != id));
    };

    return (
        <div className="app-wrapper">

            <section className="wild-pokemon">
                <form  onSubmit={handleSubmit(onSubmit)}>
                    <input className="form-pokemon" type="text" placeholder="Search a Pokemon" name="pokemon" ref={register}/>
                    <input className="form-pokemon catch-btn2" type="submit"/>
                </form>
                <img src={"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + wildPokemon.id + ".png"} className="sprite" />

                <button className="catch-btn" onClick={() => catchPokemon(wildPokemon)}>CATCH</button>
            </section>

            <section className="pokedex">
                {pokedex.length  ?
                    <div className="pokedex-list">

                        {pokedex.map(pokemon => (
                            <div className="pokemon" key={pokemon.id}>
                                <img
                                    src={"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" + pokemon.id + ".png"}
                                    className="sprite"/>
                                <h3 className="pokemon-name">{pokemon.name}</h3>
                                <h4> id: {pokemon.id}</h4>
                                <h4> Height: {pokemon.height}</h4>
                                <h4> Weight: {pokemon.weight}</h4>
                                <button className="remove" onClick={() => releasePokemon(pokemon.id)}>&times;</button>
                            </div>
                        ))}
                    </div>
                    : <h1>No pokemon register</h1>
                }
            </section>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));