import { Avatar } from '@mui/material';
import React, { useState } from 'react';
import { updateProfilePic } from '../../services/apiService';
import { getCurrentUser } from '../../services/authService';
import '../../styles/profile-pic.css';
import HomefixLoading from './HomefixLoading';

export default function ProfilePicAvatar({ profilePic }) {
  const [fileRef] = useState(React.createRef());
  const [refresh, toggle] = useState(false);
  const [isLoading, toggleIsLoading] = useState(false);

  return (
    <>
      <HomefixLoading isLoading={isLoading} />
      <input
        ref={fileRef}
        accept="image/*"
        style={{ display: 'none' }}
        id="profilePic"
        multiple={false}
        type="file"
        onChange={async (e) => {
          e.preventDefault();
          toggleIsLoading(true);
          const user = getCurrentUser();
          if (!user) return;
          var reader = new FileReader();
          let file = e.target.files[0];
          reader.onloadend = async () => {
            await updateProfilePic(user._id, {
              profilePic: reader.result
            });
            toggle(!refresh);
            toggleIsLoading(false);
          };
          reader.readAsDataURL(file);
        }}
      />
      <div
        className="container-user-profile"
        style={{ justifyContent: ' center', display: 'flex' }}
      >
        <Avatar
          alt="profilePic"
          src={`${profilePic}?${refresh}`}
          key={Date.now()}
          style={{
            margin: '10px',
            width: 150,
            height: 150
          }}
          className="image-profile-pic"
        />
        <div className="overlay-user-profile">
          {/* //todo tira warning  */}
          {/* Warning: Invalid value for prop `href` on <a> tag */}
          <a
            href="# "
            onClick={() => {
              const fileElem = fileRef.current;
              if (fileElem) {
                fileElem.click();
              }
            }}
            className="icon-user-profile"
            title="User Profile"
          >
            Cambiar imagen
          </a>
        </div>
      </div>
    </>
  );
}
