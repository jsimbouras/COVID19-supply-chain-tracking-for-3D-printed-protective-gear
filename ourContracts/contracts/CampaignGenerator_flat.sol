pragma solidity ^0.6.0;

/*
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with GSN meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
contract Context {
    // Empty internal constructor, to prevent people from mistakenly deploying
    // an instance of this contract, which should be used via inheritance.
    constructor () internal {}

    function _msgSender() internal view virtual returns (address payable) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes memory) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}


/**
 * @dev Library for managing
 * https://en.wikipedia.org/wiki/Set_(abstract_data_type)[sets] of primitive
 * types.
 *
 * Sets have the following properties:
 *
 * - Elements are added, removed, and checked for existence in constant time
 * (O(1)).
 * - Elements are enumerated in O(n). No guarantees are made on the ordering.
 *
 * ```
 * contract Example {
 *     // Add the library methods
 *     using EnumerableSet for EnumerableSet.AddressSet;
 *
 *     // Declare a set state variable
 *     EnumerableSet.AddressSet private mySet;
 * }
 * ```
 *
 * As of v3.0.0, only sets of type `address` (`AddressSet`) and `uint256`
 * (`UintSet`) are supported.
 */
library EnumerableSet {
    // To implement this library for multiple types with as little code
    // repetition as possible, we write it in terms of a generic Set type with
    // bytes32 values.
    // The Set implementation uses private functions, and user-facing
    // implementations (such as AddressSet) are just wrappers around the
    // underlying Set.
    // This means that we can only create new EnumerableSets for types that fit
    // in bytes32.

    struct Set {
        // Storage of set values
        bytes32[] _values;

        // Position of the value in the `values` array, plus 1 because index 0
        // means a value is not in the set.
        mapping (bytes32 => uint256) _indexes;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function _add(Set storage set, bytes32 value) private returns (bool) {
        if (!_contains(set, value)) {
            set._values.push(value);
            // The value is stored at length-1, but we add 1 to all indexes
            // and use 0 as a sentinel value
            set._indexes[value] = set._values.length;
            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function _remove(Set storage set, bytes32 value) private returns (bool) {
        // We read and store the value's index to prevent multiple reads from the same storage slot
        uint256 valueIndex = set._indexes[value];

        if (valueIndex != 0) { // Equivalent to contains(set, value)
            // To delete an element from the _values array in O(1), we swap the element to delete with the last one in
            // the array, and then remove the last element (sometimes called as 'swap and pop').
            // This modifies the order of the array, as noted in {at}.

            uint256 toDeleteIndex = valueIndex - 1;
            uint256 lastIndex = set._values.length - 1;

            // When the value to delete is the last one, the swap operation is unnecessary. However, since this occurs
            // so rarely, we still do the swap anyway to avoid the gas cost of adding an 'if' statement.

            bytes32 lastvalue = set._values[lastIndex];

            // Move the last value to the index where the value to delete is
            set._values[toDeleteIndex] = lastvalue;
            // Update the index for the moved value
            set._indexes[lastvalue] = toDeleteIndex + 1; // All indexes are 1-based

            // Delete the slot where the moved value was stored
            set._values.pop();

            // Delete the index for the deleted slot
            delete set._indexes[value];

            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function _contains(Set storage set, bytes32 value) private view returns (bool) {
        return set._indexes[value] != 0;
    }

    /**
     * @dev Returns the number of values on the set. O(1).
     */
    function _length(Set storage set) private view returns (uint256) {
        return set._values.length;
    }

   /**
    * @dev Returns the value stored at position `index` in the set. O(1).
    *
    * Note that there are no guarantees on the ordering of values inside the
    * array, and it may change when more values are added or removed.
    *
    * Requirements:
    *
    * - `index` must be strictly less than {length}.
    */
    function _at(Set storage set, uint256 index) private view returns (bytes32) {
        require(set._values.length > index, "EnumerableSet: index out of bounds");
        return set._values[index];
    }

    // AddressSet

    struct AddressSet {
        Set _inner;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function add(AddressSet storage set, address value) internal returns (bool) {
        return _add(set._inner, bytes32(uint256(value)));
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function remove(AddressSet storage set, address value) internal returns (bool) {
        return _remove(set._inner, bytes32(uint256(value)));
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function contains(AddressSet storage set, address value) internal view returns (bool) {
        return _contains(set._inner, bytes32(uint256(value)));
    }

    /**
     * @dev Returns the number of values in the set. O(1).
     */
    function length(AddressSet storage set) internal view returns (uint256) {
        return _length(set._inner);
    }

   /**
    * @dev Returns the value stored at position `index` in the set. O(1).
    *
    * Note that there are no guarantees on the ordering of values inside the
    * array, and it may change when more values are added or removed.
    *
    * Requirements:
    *
    * - `index` must be strictly less than {length}.
    */
    function at(AddressSet storage set, uint256 index) internal view returns (address) {
        return address(uint256(_at(set._inner, index)));
    }


    // UintSet

    struct UintSet {
        Set _inner;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function add(UintSet storage set, uint256 value) internal returns (bool) {
        return _add(set._inner, bytes32(value));
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function remove(UintSet storage set, uint256 value) internal returns (bool) {
        return _remove(set._inner, bytes32(value));
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function contains(UintSet storage set, uint256 value) internal view returns (bool) {
        return _contains(set._inner, bytes32(value));
    }

    /**
     * @dev Returns the number of values on the set. O(1).
     */
    function length(UintSet storage set) internal view returns (uint256) {
        return _length(set._inner);
    }

   /**
    * @dev Returns the value stored at position `index` in the set. O(1).
    *
    * Note that there are no guarantees on the ordering of values inside the
    * array, and it may change when more values are added or removed.
    *
    * Requirements:
    *
    * - `index` must be strictly less than {length}.
    */
    function at(UintSet storage set, uint256 index) internal view returns (uint256) {
        return uint256(_at(set._inner, index));
    }
}

pragma experimental ABIEncoderV2;







/**
 * @dev Collection of functions related to the address type
 */
library Address {
    /**
     * @dev Returns true if `account` is a contract.
     *
     * [IMPORTANT]
     * ====
     * It is unsafe to assume that an address for which this function returns
     * false is an externally-owned account (EOA) and not a contract.
     *
     * Among others, `isContract` will return false for the following
     * types of addresses:
     *
     *  - an externally-owned account
     *  - a contract in construction
     *  - an address where a contract will be created
     *  - an address where a contract lived, but was destroyed
     * ====
     */
    function isContract(address account) internal view returns (bool) {
        // According to EIP-1052, 0x0 is the value returned for not-yet created accounts
        // and 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470 is returned
        // for accounts without code, i.e. `keccak256('')`
        bytes32 codehash;
        bytes32 accountHash = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;
        // solhint-disable-next-line no-inline-assembly
        assembly { codehash := extcodehash(account) }
        return (codehash != accountHash && codehash != 0x0);
    }

    /**
     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to
     * `recipient`, forwarding all available gas and reverting on errors.
     *
     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost
     * of certain opcodes, possibly making contracts go over the 2300 gas limit
     * imposed by `transfer`, making them unable to receive funds via
     * `transfer`. {sendValue} removes this limitation.
     *
     * https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].
     *
     * IMPORTANT: because control is transferred to `recipient`, care must be
     * taken to not create reentrancy vulnerabilities. Consider using
     * {ReentrancyGuard} or the
     * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].
     */
    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Address: insufficient balance");

        // solhint-disable-next-line avoid-low-level-calls, avoid-call-value
        (bool success, ) = recipient.call{ value: amount }("");
        require(success, "Address: unable to send value, recipient may have reverted");
    }
}




/**
 * @dev Contract module that allows children to implement role-based access
 * control mechanisms.
 *
 * Roles are referred to by their `bytes32` identifier. These should be exposed
 * in the external API and be unique. The best way to achieve this is by
 * using `public constant` hash digests:
 *
 * ```
 * bytes32 public constant MY_ROLE = keccak256("MY_ROLE");
 * ```
 *
 * Roles can be used to represent a set of permissions. To restrict access to a
 * function call, use {hasRole}:
 *
 * ```
 * function foo() public {
 *     require(hasRole(MY_ROLE, _msgSender()));
 *     ...
 * }
 * ```
 *
 * Roles can be granted and revoked dynamically via the {grantRole} and
 * {revokeRole} functions. Each role has an associated admin role, and only
 * accounts that have a role's admin role can call {grantRole} and {revokeRole}.
 *
 * By default, the admin role for all roles is `DEFAULT_ADMIN_ROLE`, which means
 * that only accounts with this role will be able to grant or revoke other
 * roles. More complex role relationships can be created by using
 * {_setRoleAdmin}.
 */
abstract contract AccessControl is Context {
    using EnumerableSet for EnumerableSet.AddressSet;
    using Address for address;

    struct RoleData {
        EnumerableSet.AddressSet members;
        bytes32 adminRole;
    }

    mapping(bytes32 => RoleData) private _roles;
    mapping(address => bytes32) public whichRole;

    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;

    /**
     * @dev Emitted when `account` is granted `role`.
     *
     * `sender` is the account that originated the contract call, an admin role
     * bearer except when using {_setupRole}.
     */
    event RoleGranted(
        bytes32 indexed role,
        address indexed account,
        address indexed sender
    );

    /**
     * @dev Emitted when `account` is revoked `role`.
     *
     * `sender` is the account that originated the contract call:
     *   - if using `revokeRole`, it is the admin role bearer
     *   - if using `renounceRole`, it is the role bearer (i.e. `account`)
     */
    event RoleRevoked(
        bytes32 indexed role,
        address indexed account,
        address indexed sender
    );

    /**
     * @dev Returns `true` if `account` has been granted `role`.
     */
    function hasRole(bytes32 role, address account) public view returns (bool) {
        return _roles[role].members.contains(account);
    }

    /**
     * @dev Returns the number of accounts that have `role`. Can be used
     * together with {getRoleMember} to enumerate all bearers of a role.
     */
    function getRoleMemberCount(bytes32 role) public view returns (uint256) {
        return _roles[role].members.length();
    }

    /**
     * @dev Returns one of the accounts that have `role`. `index` must be a
     * value between 0 and {getRoleMemberCount}, non-inclusive.
     *
     * Role bearers are not sorted in any particular way, and their ordering may
     * change at any point.
     *
     * WARNING: When using {getRoleMember} and {getRoleMemberCount}, make sure
     * you perform all queries on the same block. See the following
     * https://forum.openzeppelin.com/t/iterating-over-elements-on-enumerableset-in-openzeppelin-contracts/2296[forum post]
     * for more information.
     */
    function getRoleMember(bytes32 role, uint256 index)
        public
        view
        returns (address)
    {
        return _roles[role].members.at(index);
    }

    /**
     * @dev Returns the admin role that controls `role`. See {grantRole} and
     * {revokeRole}.
     *
     * To change a role's admin, use {_setRoleAdmin}.
     */
    function getRoleAdmin(bytes32 role) public view returns (bytes32) {
        return _roles[role].adminRole;
    }

    /**
     * @dev Grants `role` to `account`.
     *
     * If `account` had not been already granted `role`, emits a {RoleGranted}
     * event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     */
    function grantRole(bytes32 role, address account) public virtual {
        require(
            hasRole(_roles[role].adminRole, _msgSender()),
            "AccessControl: sender must be an admin to grant"
        );
        _grantRole(role, account);
    }

    /**
     * @dev Revokes `role` from `account`.
     *
     * If `account` had been granted `role`, emits a {RoleRevoked} event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     */
    function revokeRole(bytes32 role, address account) internal virtual {
        require(
            hasRole(_roles[role].adminRole, _msgSender()),
            "AccessControl: sender must be an admin to revoke"
        );

        _revokeRole(role, account);
    }

    /**
     * @dev Revokes `role` from the calling account.
     *
     * Roles are often managed via {grantRole} and {revokeRole}: this function's
     * purpose is to provide a mechanism for accounts to lose their privileges
     * if they are compromised (such as when a trusted device is misplaced).
     *
     * If the calling account had been granted `role`, emits a {RoleRevoked}
     * event.
     *
     * Requirements:
     *
     * - the caller must be `account`.
     */
    function renounceRole(bytes32 role, address account) public virtual {
        require(
            account == _msgSender(),
            "AccessControl: can only renounce roles for self"
        );

        _revokeRole(role, account);
    }

    /**
     * @dev Grants `role` to `account`.
     *
     * If `account` had not been already granted `role`, emits a {RoleGranted}
     * event. Note that unlike {grantRole}, this function doesn't perform any
     * checks on the calling account.
     *
     * [WARNING]
     * ====
     * This function should only be called from the constructor when setting
     * up the initial roles for the system.
     *
     * Using this function in any other way is effectively circumventing the admin
     * system imposed by {AccessControl}.
     * ====
     */
    function _setupRole(bytes32 role, address account) internal virtual {
        _grantRole(role, account);
    }

    /**
     * @dev Sets `adminRole` as ``role``'s admin role.
     */
    function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual {
        _roles[role].adminRole = adminRole;
    }

    function _grantRole(bytes32 role, address account) private {
        if(whichRole[account] == role) {
            return;
        }
        require(
            whichRole[account] ==
                0x0000000000000000000000000000000000000000000000000000000000000000,
            "User already has a role(see whichRole method)"
        );
        whichRole[account] = role;
        if (_roles[role].members.add(account)) {
            emit RoleGranted(role, account, _msgSender());
        }
    }

    function _revokeRole(bytes32 role, address account) private {
        whichRole[account] = 0x0000000000000000000000000000000000000000000000000000000000000000;
        if (_roles[role].members.remove(account)) {
            emit RoleRevoked(role, account, _msgSender());
        }
    }
}




/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor () internal {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(_owner == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}



/**
 * @dev Wrappers over Solidity's arithmetic operations with added overflow
 * checks.
 *
 * Arithmetic operations in Solidity wrap on overflow. This can easily result
 * in bugs, because programmers usually assume that an overflow raises an
 * error, which is the standard behavior in high level programming languages.
 * `SafeMath` restores this intuition by reverting the transaction when an
 * operation overflows.
 *
 * Using this library instead of the unchecked operations eliminates an entire
 * class of bugs, so it's recommended to use it always.
 */
library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return sub(a, b, "SafeMath: subtraction overflow");
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return div(a, b, "SafeMath: division by zero");
    }

    /**
     * @dev Returns the integer division of two unsigned integers. Reverts with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0, errorMessage);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return mod(a, b, "SafeMath: modulo by zero");
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * Reverts with custom message when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b != 0, errorMessage);
        return a % b;
    }
}








contract Roles is AccessControl {
    //keccak256("admin")
    bytes32 public constant ADMIN_ROLE = 0xf23ec0bb4210edd5cba85afd05127efcd2fc6a781bfed49188da1081670b22d8;
    //keccak256("coordinator")
    bytes32 public constant COORDINATOR_ROLE = 0xaf8c8b3d1b230c888f16d0aac400b28aa51e631d580aaa7cb46e571590ed44e7;
    //keccak256("courier")
    bytes32 public constant COURIER_ROLE = 0x7fc3771f539a03c47afbbf258702c19273ef5e735e24ee7978081dc07288c687;
    //keccak256("manufaturer")
    bytes32 public constant MANUFACTURER_ROLE = 0xb528929ed79eb79a87ae6f578d3125509c91bfea9ac8b7fb9f69aa0bc28298dd;
    //keccka256("receiver")
    bytes32 public constant RECEIVER_ROLE = 0x5e784e45feb63c375016d4ce5c52a57b0a48b8a170bc2e31463be0d03d1c4db6;

    constructor(address _admin) public {
        _setupRole(ADMIN_ROLE, _admin);
        _setRoleAdmin(COORDINATOR_ROLE, ADMIN_ROLE);
        _setRoleAdmin(COURIER_ROLE, COORDINATOR_ROLE);
        _setRoleAdmin(MANUFACTURER_ROLE, COORDINATOR_ROLE);
        _setRoleAdmin(RECEIVER_ROLE, COORDINATOR_ROLE);
    }

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, _msgSender()), "Only admin is allowed");
        _;
    }
    modifier onlyCoordinator() {
        require(
            hasRole(COORDINATOR_ROLE, _msgSender()),
            "Only coordinator is allowed"
        );
        _;
    }
    modifier onlyCourier() {
        require(hasRole(COURIER_ROLE, _msgSender()), "Only courier is allowed");
        _;
    }
    modifier onlyManufaturer() {
        require(
            hasRole(MANUFACTURER_ROLE, _msgSender()),
            "Only manufaturer is allowed"
        );
        _;
    }
    function getRole(address _who) public view returns(bytes32){
          if(hasRole(ADMIN_ROLE,_who)) return ADMIN_ROLE;
          if(hasRole(COORDINATOR_ROLE,_who)) return COORDINATOR_ROLE;
          if(hasRole(COURIER_ROLE,_who)) return COURIER_ROLE;
          if(hasRole(MANUFACTURER_ROLE,_who)) return MANUFACTURER_ROLE;
          if(hasRole(RECEIVER_ROLE,_who)) return RECEIVER_ROLE;
    }
}



contract Storage {
    enum BatchStages {
        NotStarted,
        PLAPacked,
        PLAPickedUpByCourier1, //states chages to this with sig of coordinator and courier both
        PLARecivedByManufaturer, //states chages to this with sig of courier and manufaturer both
        MasksReady,
        MasksPickedUpByCourier2, //states chages to this with sig of manufature and courier both
        MasksRceivedByReceiver, //states chages to this with sig of courier and reciver both
        MasksVerifiedForQuality
    }
    struct AddressSet {
        address[] addresses;
        mapping(address => uint256) addressIndex;
    }
    // //what else?
    // enum CampaignStages{
    //     campaignStarted,
    //     campaignFinished
    // }
    struct Batch {
        BatchStages stage;
        bool isPLAPickedUpCourier1;
        bool isPLAPickedUpCoordinator;
        bool isPLARecivedCourier1;
        bool isPLAReceivedManufacturer;
        bool isMasksPickedUpCourier2;
        bool isMasksPickedUpManufacturer;
        bool isMasksaReceviedCourier2;
        bool isMasksReceviedReceviver;
        uint256 amountOfPLA;
        uint256 amountOfExpectedMasks;
        uint256 amountOfMasksMade;
        uint256 tfForDeliveryToManufacturer;
        uint256 tfForMakingMasks;
        uint256 tfForDeliveryToReciver;
        address courier1;
        address courier2;
        address manufacturer;
    }

    struct Campaign {
        // CampaignStages stage,
        uint256 totalPLA;
        uint256 currentPLA;
        uint256 batchCounter;
        address coordinator;
        address receiver;
        AddressSet manufacturers;
        AddressSet couriers;
        mapping(uint256 => Batch) batches;
        mapping(address => uint256[]) belongsToBatch;
        // uint256 batchSize;
    }

    mapping(uint256 => Campaign) campaigns; //campaign's Index in the campaigns array + 1 (becuse 0 means it is not in the array)
    uint256 public campaignCounter = 1;
    mapping(address => uint256[]) belongsToCampign;
}


contract CampaignGenerator is Ownable, Roles, Storage {
    using SafeMath for uint256;

    event CampaignStarted(uint256 campaignId);
    event PLAPacked(uint256 campaignId, uint256 branchId);
    event PLAPickedUpByCourier1(uint256 campaignId, uint256 branchId); //emits with sig of coordinator and courier both
    event PLARecivedByManufacturer(uint256 campaignId, uint256 branchId); //emits with sig of courier and manufaturer both
    event MasksReady(
        uint256 campaignId,
        uint256 branchId,
        uint256 amountOfMasksMade
    );
    event MasksPickedUpByCourier2(uint256 campaignId, uint256 branchId); //emits with sig of manufature and courier both
    event MasksRceivedByReceiver(uint256 campaignId, uint256 branchId); //emitswith sig of courier and reciver both
    event MasksVerifiedForQuality(uint256 campaignId, uint256 branchId);

    constructor(address _admin) public Roles(_admin) {}

    function makeCoordinator(address _who) public onlyAdmin() {
        grantRole(COORDINATOR_ROLE, _who);
    }

    function startCampaign(
        address[] memory _manufacturers,
        address[] memory _couriers,
        address _receiver,
        uint256 _totalPLA
    ) public onlyCoordinator() returns (uint256 campaignId) {
        campaignId = campaignCounter;
        Campaign storage campaign = campaigns[campaignId];
        campaignCounter = campaignCounter.add(1);

        belongsToCampign[_msgSender()].push(campaignId);
        //In future iteration campaign id can be deterministically generated form title and description of the campaign i.e. keccak(title+description)

        campaign.coordinator = _msgSender();

        for (uint256 i = 0; i < _manufacturers.length; i = i.add(1)) {
            grantRole(MANUFACTURER_ROLE, _manufacturers[i]);
            campaign.manufacturers.addressIndex[_manufacturers[i]] = i.add(1);
            belongsToCampign[_manufacturers[i]].push(campaignId);
        }
        for (uint256 i = 0; i < _couriers.length; i = i.add(1)) {
            grantRole(COURIER_ROLE, _couriers[i]);
            campaign.couriers.addressIndex[_couriers[i]] = i.add(1);
            belongsToCampign[_couriers[i]].push(campaignId);
        }

        campaign.manufacturers.addresses = _manufacturers;
        campaign.couriers.addresses = _couriers;

        //add receiver
        grantRole(RECEIVER_ROLE, _receiver);
        campaign.receiver = _receiver;
        belongsToCampign[_receiver].push(campaignId);
        campaign.batchCounter = 0;

        campaign.totalPLA = _totalPLA;
        campaign.currentPLA = _totalPLA;
        emit CampaignStarted(campaignId);
    }

    function addManufacturers(
        uint256 _campaignId,
        address[] memory _manufacturers
    ) public onlyCoordinator() {
        require(
            campaigns[_campaignId].coordinator == _msgSender(),
            "Only coordinator of camapignId is allowed"
        );
        Campaign storage campaign = campaigns[_campaignId];
        uint256 arrayLength = campaign.manufacturers.addresses.length;

        for (uint256 i = 0; i < _manufacturers.length; i = i.add(1)) {
            grantRole(MANUFACTURER_ROLE, _manufacturers[i]);

            campaign.manufacturers.addresses.push(_manufacturers[i]);
            campaign.manufacturers.addressIndex[_manufacturers[i]] = arrayLength
                .add(i.add(1));
            belongsToCampign[_manufacturers[i]].push(_campaignId);
        }
    }

    function addCouriers(uint256 _campaignId, address[] memory _couriers)
        public
        onlyCoordinator()
    {
        require(
            campaigns[_campaignId].coordinator == _msgSender(),
            "Only coordinator of camapignId is allowed"
        );
        Campaign storage campaign = campaigns[_campaignId];
        uint256 arrayLength = campaign.couriers.addresses.length;

        for (uint256 i = 0; i < _couriers.length; i = i.add(1)) {
            grantRole(MANUFACTURER_ROLE, _couriers[i]);

            campaign.couriers.addresses.push(_couriers[i]);
            campaign.couriers.addressIndex[_couriers[i]] = arrayLength.add(
                i.add(1)
            );
            belongsToCampign[_couriers[i]].push(_campaignId);
        }
    }

    function createNewBatch(
        uint256 _campaignId,
        uint256 _amountOfPLA,
        uint256 _amountOfExpectedMasks,
        uint256 _tfForDeliveryToManufacturer,
        uint256 _tfForMakingMasks,
        uint256 _tfForDeliveryToReciver,
        address _courier1,
        address _courier2,
        address _manufacturer
    ) public onlyCoordinator() returns (uint256 batchId) {
        require(
            campaigns[_campaignId].coordinator == _msgSender(),
            "Only coordinator of camapignId is allowed"
        );
        require(
            campaigns[_campaignId].couriers.addressIndex[_courier1] != 0,
            "add courier to campaign first"
        );
        require(
            campaigns[_campaignId].couriers.addressIndex[_courier2] != 0,
            "add courier to campaign first"
        );
        require(
            campaigns[_campaignId].manufacturers.addressIndex[_manufacturer] !=
                0,
            "add manufaturer to campaign first"
        );
        campaigns[_campaignId].batchCounter = campaigns[_campaignId]
            .batchCounter
            .add(1);

        batchId = campaigns[_campaignId].batchCounter;
        Batch storage batch = campaigns[_campaignId].batches[batchId];
        //substract the PLA from currentPLA
        campaigns[_campaignId].currentPLA = campaigns[_campaignId]
            .currentPLA
            .sub(_amountOfPLA);
        //update the batchStage
        batch.stage = BatchStages.PLAPacked;

        batch.amountOfPLA = _amountOfPLA;
        batch.amountOfExpectedMasks = _amountOfExpectedMasks;

        batch.tfForDeliveryToManufacturer = _tfForDeliveryToManufacturer;

        batch.tfForMakingMasks = _tfForMakingMasks;

        batch.tfForDeliveryToReciver = _tfForDeliveryToReciver;

        batch.courier1 = _courier1;
        campaigns[_campaignId].belongsToBatch[_courier1].push(batchId);

        batch.courier2 = _courier2;
        campaigns[_campaignId].belongsToBatch[_courier2].push(batchId);

        batch.manufacturer = _manufacturer;
        campaigns[_campaignId].belongsToBatch[_manufacturer].push(batchId);

        campaigns[_campaignId].belongsToBatch[_msgSender()].push(batchId);
        emit PLAPacked(_campaignId, batchId);
    }

    //the chain Starts
    function confirmPLAPickedUpByCourier1(uint256 _campaignId, uint256 _batchId)
        public
        returns (bool stageChange)
    {
        require(
            campaigns[_campaignId].coordinator == _msgSender() ||
                campaigns[_campaignId].batches[_batchId].courier1 ==
                _msgSender(),
            "Only coordinator of camapignId or courier is allowed"
        );
        stageChange = false;
        if (campaigns[_campaignId].coordinator == _msgSender()) {
            campaigns[_campaignId].batches[_batchId]
                .isPLAPickedUpCoordinator = true;
        }
        if (campaigns[_campaignId].batches[_batchId].courier1 == _msgSender()) {
            campaigns[_campaignId].batches[_batchId]
                .isPLAPickedUpCourier1 = true;
        }
        if (
            campaigns[_campaignId].batches[_batchId].isPLAPickedUpCoordinator ==
            true &&
            campaigns[_campaignId].batches[_batchId].isPLAPickedUpCourier1 ==
            true
        ) {
            campaigns[_campaignId].batches[_batchId].stage = BatchStages
                .PLAPickedUpByCourier1;

            emit PLAPickedUpByCourier1(_campaignId, _batchId);
            stageChange = true;
        }
    }

    function confirmPLARecivedByManufacturer(
        uint256 _campaignId,
        uint256 _batchId
    ) public returns (bool stageChange) {
        require(
            campaigns[_campaignId].batches[_batchId].manufacturer ==
                _msgSender() ||
                campaigns[_campaignId].batches[_batchId].courier1 ==
                _msgSender(),
            "Only manufacturer or courier of batch is allowed"
        );
        stageChange = false;
        if (
            campaigns[_campaignId].batches[_batchId].manufacturer ==
            _msgSender()
        ) {
            campaigns[_campaignId].batches[_batchId]
                .isPLAReceivedManufacturer = true;
        }
        if (campaigns[_campaignId].batches[_batchId].courier1 == _msgSender()) {
            campaigns[_campaignId].batches[_batchId]
                .isPLARecivedCourier1 = true;
        }
        if (
            campaigns[_campaignId].batches[_batchId]
                .isPLAReceivedManufacturer ==
            true &&
            campaigns[_campaignId].batches[_batchId].isPLARecivedCourier1 ==
            true
        ) {
            campaigns[_campaignId].batches[_batchId].stage = BatchStages
                .PLARecivedByManufaturer;

            emit PLARecivedByManufacturer(_campaignId, _batchId);
            stageChange = true;
        }
    }

    function confirmMasksMade(
        uint256 _campaignId,
        uint256 _batchId,
        uint256 _amountOfMasksMade
    ) public {
        require(
            campaigns[_campaignId].batches[_batchId].manufacturer ==
                _msgSender(),
            "Only manufacturer of batch is allowed"
        );
        campaigns[_campaignId].batches[_batchId]
            .amountOfMasksMade = _amountOfMasksMade;
        campaigns[_campaignId].batches[_batchId].stage = BatchStages.MasksReady;
        emit MasksReady(_campaignId, _batchId, _amountOfMasksMade);
    }

    function confirmMasksPickedUpByCourier2(
        uint256 _campaignId,
        uint256 _batchId
    ) public returns (bool stageChange) {
        require(
            campaigns[_campaignId].batches[_batchId].manufacturer ==
                _msgSender() ||
                campaigns[_campaignId].batches[_batchId].courier2 ==
                _msgSender(),
            "Only manufacturer or courier of batch is allowed"
        );
        stageChange = false;
        if (
            campaigns[_campaignId].batches[_batchId].manufacturer ==
            _msgSender()
        ) {
            campaigns[_campaignId].batches[_batchId]
                .isMasksPickedUpManufacturer = true;
        }
        if (campaigns[_campaignId].batches[_batchId].courier2 == _msgSender()) {
            campaigns[_campaignId].batches[_batchId]
                .isMasksPickedUpCourier2 = true;
        }
        if (
            campaigns[_campaignId].batches[_batchId]
                .isMasksPickedUpManufacturer ==
            true &&
            campaigns[_campaignId].batches[_batchId].isMasksPickedUpCourier2 ==
            true
        ) {
            campaigns[_campaignId].batches[_batchId].stage = BatchStages
                .MasksPickedUpByCourier2;

            emit MasksPickedUpByCourier2(_campaignId, _batchId);
            stageChange = true;
        }
    }

    function confirmMasksRceivedByReceiver(
        uint256 _campaignId,
        uint256 _batchId
    ) public returns (bool stageChange) {
        require(
            campaigns[_campaignId].receiver == _msgSender() ||
                campaigns[_campaignId].batches[_batchId].courier2 ==
                _msgSender(),
            "Only reciver of camapignId or courier is allowed"
        );
        stageChange = false;
        if (campaigns[_campaignId].receiver == _msgSender()) {
            campaigns[_campaignId].batches[_batchId]
                .isMasksReceviedReceviver = true;
        }
        if (campaigns[_campaignId].batches[_batchId].courier2 == _msgSender()) {
            campaigns[_campaignId].batches[_batchId]
                .isMasksaReceviedCourier2 = true;
        }
        if (
            campaigns[_campaignId].batches[_batchId].isMasksReceviedReceviver ==
            true &&
            campaigns[_campaignId].batches[_batchId].isMasksaReceviedCourier2 ==
            true
        ) {
            campaigns[_campaignId].batches[_batchId].stage = BatchStages
                .MasksRceivedByReceiver;

            emit MasksRceivedByReceiver(_campaignId, _batchId);
            stageChange = true;
        }
    }

    //for test
    function getCampaignDetalis(uint256 _campaignId)
        public
        view
        returns (
            uint256 totalPLA,
            uint256 currentPLA,
            uint256 totalBatches,
            address coordinator,
            address receiver,
            address[] memory manufacturers,
            address[] memory couriers
        )
    {
        coordinator = campaigns[_campaignId].coordinator;
        totalPLA = campaigns[_campaignId].totalPLA;
        currentPLA = campaigns[_campaignId].currentPLA;
        receiver = campaigns[_campaignId].receiver;
        totalBatches = campaigns[_campaignId].batchCounter;
        manufacturers = campaigns[_campaignId].manufacturers.addresses;
        couriers = campaigns[_campaignId].couriers.addresses;
    }

    function getBatchDetails(uint256 _campaignId, uint256 _batchId)
        public
        view
        returns (Batch memory batch)
    {
        batch = campaigns[_campaignId].batches[_batchId];
    }

    //given the address returns all the campaigns it is part of
    function partOfWhichCampaigns(address _who)
        public
        view
        returns (uint256[] memory)
    {
        return belongsToCampign[_who];
    }

    //given campaignId and address returns all the batches it is part of for that capaign
    function partOfWhichBatches(uint256 _campaignId, address _who)
        public
        view
        returns (uint256[] memory)
    {
        return campaigns[_campaignId].belongsToBatch[_who];
    }
}
