import { Button, Callout, FormGroup, InputGroup } from "@blueprintjs/core";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

const Register = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [userContext, setUserContext] = useContext(UserContext);

  const formSubmitHandler = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const genericErrorMessage = "Something went wrong! Please try again later.";

    fetch(import.meta.env.VITE_API_ENDPOINT + "users/signup", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        username: email,
        password,
      }),
    })
      .then(async (response) => {
        setIsSubmitting(false);
        if (!response.ok) {
          if (response.status === 400) {
            setError("Please fill all the fields correctly!");
          } else if (response.status === 401) {
            setError("Invalid email and password combination!");
          } else if (response.status === 500) {
            console.log(response);
            const data = await response.json();
            if (data.message) setError(data.message || genericErrorMessage);
          } else {
            setError(genericErrorMessage);
          }
        } else {
          const data = await response.json();
          setUserContext((oldValues) => {
            console.log(oldValues);
            return { ...oldValues, token: data.token };
          });
        }
      })
      // eslint-disable-next-line no-unused-vars
      .catch((error) => {
        setIsSubmitting(false);
        setError(genericErrorMessage);
      });
  };

  return (
    <>
      {error && <Callout intent='danger'>{error}</Callout>}

      <form onSubmit={formSubmitHandler} className='auth-form'>
        <FormGroup className='input' label='First Name' labelFor='firstName'>
          <InputGroup
            id='firstName'
            placeholder='First Name'
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
          />
        </FormGroup>
        <FormGroup label='Last Name' labelFor='firstName'>
          <InputGroup
            id='lastName'
            placeholder='Last Name'
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
          />
        </FormGroup>
        <FormGroup label='Email' labelFor='email'>
          <InputGroup
            id='email'
            type='email'
            placeholder='Email'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </FormGroup>
        <FormGroup label='Password' labelFor='password'>
          <InputGroup
            id='password'
            placeholder='Password'
            type='password'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </FormGroup>
        <Button
          className='regBtn'
          intent='warning'
          disabled={isSubmitting}
          text={`${isSubmitting ? "Registering" : "Register"}`}
          fill
          type='submit'
        />
      </form>
    </>
  );
};

export default Register;
